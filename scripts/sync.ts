import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const registry = process.argv.includes("--registry");
const targets = process.argv
  .slice(2)
  .filter((arg) => arg !== "--registry")
  .map((arg) => resolve(arg));
if (!targets.length)
  throw Error(
    "Usage: bun run dev:sync -- ../picloom ../picloom-extensions (or a generated project)",
  );
const directories = [
  "plugin-sdk",
  "theme-sdk",
  "package-rules",
  "tools/create-plugin",
  "tools/create-theme",
  "tools/plugin-tools",
  "tools/theme-tools",
];
const packages = await Promise.all(
  directories.map(async (directory) => ({
    directory,
    manifest: await Bun.file(join(root, directory, "package.json")).json(),
  })),
);
async function run(cmd: string[], cwd: string) {
  const child = Bun.spawn(cmd, { cwd, stdout: "inherit", stderr: "inherit" });
  if (await child.exited) throw Error(`Command failed: ${cmd.join(" ")}`);
}
// Only root and declared workspaces are edited; never scan dependencies or generated output.
async function manifests(target: string) {
  const files = [join(target, "package.json")];
  const manifest = await Bun.file(files[0]!).json();
  for (const pattern of manifest.workspaces ?? []) {
    if (pattern.endsWith("/*")) {
      const parent = join(target, pattern.slice(0, -2));
      for (const entry of await readdir(parent, { withFileTypes: true }))
        if (
          entry.isDirectory() &&
          (await Bun.file(join(parent, entry.name, "package.json")).exists())
        )
          files.push(join(parent, entry.name, "package.json"));
    } else if (!pattern.includes("*"))
      files.push(join(target, pattern, "package.json"));
    else throw Error(`Unsupported workspace pattern: ${pattern}`);
  }
  return files;
}
const consumers = await Promise.all(
  targets.map(async (target) => {
    if (target === root)
      throw Error("The tooling workspace must not sync to itself");
    return { target, files: await manifests(target) };
  }),
);
const temporary = await mkdtemp(join(tmpdir(), "picloom-pack-"));
try {
  const archives = new Map<string, { path: string; name: string }>();
  if (!registry) {
    await run([process.execPath, "run", "build"], root);
    for (const pkg of packages) {
      const path = join(
        temporary,
        pkg.manifest.name.replace("@", "").replaceAll("/", "-") + ".tgz",
      );
      await run(
        [
          process.execPath,
          "pm",
          "pack",
          "--ignore-scripts",
          "--filename",
          path,
          "--quiet",
        ],
        join(root, pkg.directory),
      );
      const hash = createHash("sha256")
        .update(await readFile(path))
        .digest("hex")
        .slice(0, 16);
      archives.set(pkg.manifest.name, {
        path,
        name: `${pkg.manifest.name.split("/")[1]}-${pkg.manifest.version}-${hash}.tgz`,
      });
    }
  }
  for (const { target, files } of consumers) {
    for (const file of files) {
      const manifest = await Bun.file(file).json();
      let changed = false;
      for (const section of [
        "dependencies",
        "devDependencies",
        "optionalDependencies",
      ]) {
        for (const pkg of packages) {
          if (!manifest[section]?.[pkg.manifest.name]) continue;
          let version = pkg.manifest.version;
          if (!registry) {
            const archive = archives.get(pkg.manifest.name)!;
            const destination = join(target, ".local-packages", archive.name);
            await mkdir(dirname(destination), { recursive: true });
            await cp(archive.path, destination);
            version = "file:" + relative(dirname(file), destination);
          }
          manifest[section][pkg.manifest.name] = version;
          changed = true;
        }
      }
      if (changed)
        await writeFile(file, JSON.stringify(manifest, null, 2) + "\n");
    }
    if (!registry) await run([process.execPath, "install"], target);
    else
      console.log(
        `${target}: registry versions restored; publish packages before bun install and committing the refreshed lockfile.`,
      );
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
