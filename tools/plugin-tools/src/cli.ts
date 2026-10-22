#!/usr/bin/env bun
import { buildPlugin } from "./build";
if (process.argv.length !== 3 || process.argv[2] !== "build")
  throw Error("Usage: picloom-plugin build");
await buildPlugin();
