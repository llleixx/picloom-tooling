import { rm } from "node:fs/promises";
await rm(`${import.meta.dir}/dist`, { recursive: true, force: true });
const result = await Bun.build({
  entrypoints: [`${import.meta.dir}/src/cli.ts`],
  outdir: `${import.meta.dir}/dist`,
  target: "bun",
  format: "esm",
});
if (!result.success) throw Error(result.logs.join("\n"));
