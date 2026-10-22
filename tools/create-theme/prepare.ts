import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dir, "../..");
const output = resolve(import.meta.dir, "dist/template");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(import.meta.dir, "template"), output, { recursive: true });
await cp(resolve(root, "LICENSE"), output + "/LICENSE");
console.log(output);
