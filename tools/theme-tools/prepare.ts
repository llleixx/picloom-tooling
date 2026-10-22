import { cp, rm, mkdir } from "node:fs/promises";
const output = `${import.meta.dir}/dist`;
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const [entrypoints, target, external] of [
  [["src/cli.ts"], "bun", ["vite"]],
  [["src/main.ts"], "browser", ["virtual:picloom-preview"]],
] as const) {
  const result = await Bun.build({
    entrypoints: entrypoints.map((path) => `${import.meta.dir}/${path}`),
    outdir: output,
    target,
    format: "esm",
    external: [...external],
    naming: target === "browser" ? "client.js" : "[name].js",
  });
  if (!result.success) throw Error(result.logs.join("\n"));
}
await cp(`${import.meta.dir}/src/index.html`, `${output}/index.html`);
