#!/usr/bin/env bun
import { preview } from "./serve";
import { buildTheme } from "./build";
const [command, ...args] = process.argv.slice(2);
if (command === "dev" || command === "preview") {
  if (args.includes("--preview")) throw Error("Use picloom-theme preview");
  await preview(command === "preview" ? ["--preview", ...args] : args);
} else if (command === "build" && !args.length) {
  await buildTheme();
} else {
  throw Error(
    "Usage: picloom-theme dev|preview [--port 5173] | picloom-theme build",
  );
}
