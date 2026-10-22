import { expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { isBuiltin } from "node:module";
import { resolve, dirname, relative } from "node:path";

test("tooling packages import only their own source and declared public dependencies", async () => {
  for (const directory of [
    "plugin-sdk",
    "theme-sdk",
    "package-rules",
    "tools/plugin-tools",
    "tools/theme-tools",
    "tools/create-plugin",
    "tools/create-theme",
  ]) {
    const root = resolve(import.meta.dir, "..", directory);
    const manifest = await Bun.file(resolve(root, "package.json")).json();
    const dependencies = new Set(
      Object.keys({
        ...manifest.dependencies,
        ...manifest.devDependencies,
        ...manifest.peerDependencies,
      }),
    );
    for (const name of await readdir(root, { recursive: true })) {
      if (
        name
          .split("/")
          .some((part) => ["node_modules", "dist", "template"].includes(part))
      )
        continue;
      if (!/\.(ts|js)$/.test(name)) continue;
      const file = resolve(root, name);
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(
        /(?:from\s+|import\s*\()["']([^"']+)["']/g,
      )) {
        const specifier = match[1]!;
        if (specifier.startsWith(".")) {
          const target = relative(root, resolve(dirname(file), specifier));
          expect(target.startsWith("..")).toBe(false);
        } else if (
          !isBuiltin(specifier) &&
          specifier !== "bun" &&
          specifier !== "virtual:picloom-preview"
        ) {
          const packageName = specifier
            .split("/")
            .slice(0, specifier.startsWith("@") ? 2 : 1)
            .join("/");
          expect(dependencies.has(packageName)).toBe(true);
        }
      }
    }
  }
});
