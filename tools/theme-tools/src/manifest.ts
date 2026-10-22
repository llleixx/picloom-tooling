import { readFile } from "node:fs/promises";
import type { Manifest } from "@picloom/theme-sdk";
import { supportedLocales, safeName, assetPath } from "./helpers";
export { assetPath } from "./helpers";
export function assertIdentity(value: any): void {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !safeName(value.id) ||
    value.id.startsWith("builtin.") ||
    !safeName(value.version)
  )
    throw Error("Invalid theme.json identity");
}
export async function readManifest(path = "theme.json"): Promise<Manifest> {
  return validateManifest(JSON.parse(await readFile(path, "utf8")));
}
export function validateManifest(value: any): Manifest {
  assertIdentity(value);
  const object = (v: unknown): v is Record<string, any> =>
    !!v && typeof v === "object" && !Array.isArray(v);
  if (
    !object(value) ||
    value.apiVersion !== 1 ||
    (value.author !== undefined &&
      (typeof value.author !== "string" ||
        !value.author.trim() ||
        value.author.length > 200)) ||
    !Array.isArray(value.supportedLocales) ||
    !value.supportedLocales.length ||
    value.supportedLocales.some(
      (v: string) => !(supportedLocales as readonly string[]).includes(v),
    ) ||
    new Set(value.supportedLocales).size !== value.supportedLocales.length ||
    !value.supportedLocales.includes(value.defaultLocale) ||
    !object(value.pages) ||
    !Object.keys(value.pages).length ||
    Object.keys(value.pages).some((key) => !["home", "login"].includes(key)) ||
    !object(value.messages) ||
    !object(value.messages[value.defaultLocale]) ||
    typeof value.nameKey !== "string" ||
    typeof value.messages[value.defaultLocale][value.nameKey] !== "string" ||
    !value.messages[value.defaultLocale][value.nameKey].trim()
  )
    throw Error(
      "Invalid theme.json: check identity, API, pages and language declarations",
    );
  for (const page of Object.values(value.pages) as Array<{
    entry: string;
    styles?: string[];
  }>) {
    if (!object(page) || !assetPath(page.entry) || !page.entry.endsWith(".js"))
      throw Error(
        "Invalid theme.json: page entry must be a safe JavaScript path",
      );
    if (
      page.styles !== undefined &&
      (!Array.isArray(page.styles) ||
        page.styles.some((p) => !assetPath(p) || !p.endsWith(".css")))
    )
      throw Error("Invalid page styles");
  }
  if (
    value.styles !== undefined &&
    (!Array.isArray(value.styles) ||
      value.styles.some((p: unknown) => !assetPath(p) || !p.endsWith(".css")))
  )
    throw Error("Invalid styles");
  if (
    value.preview !== undefined &&
    (!assetPath(value.preview) || !/\.(png|jpe?g|webp)$/i.test(value.preview))
  )
    throw Error("Invalid preview image");
  if (value.configSchema !== undefined && value.configSchema?.type !== "object")
    throw Error("configSchema must be an object schema");
  if (value.author !== undefined) value.author = value.author.trim();
  return value as Manifest;
}

export function assertToolingLayout(manifest: Manifest): void {
  if (Object.values(manifest.pages).some((page) => page.entry !== "entry.js"))
    throw Error(
      "Theme tools require src/entry.ts to build entry.js for every page; this is a tool convention, not a theme protocol restriction",
    );
}
