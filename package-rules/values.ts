/** Structural JSON schema subset used to construct editor/preview draft values. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };
export type Config = Record<string, Json>;
export interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  default?: Json;
  "x-sensitive"?: boolean;
}
function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
function pointer(key: string) {
  return key.replace(/~/g, "~0").replace(/\//g, "~1");
}
function sensitivePaths(schema: Schema, path = ""): string[] {
  if (
    schema["x-sensitive"] === true ||
    (schema.type === "array" &&
      schema.items &&
      sensitivePaths(schema.items!).length > 0)
  )
    return [path];
  return Object.entries(schema.properties ?? {}).flatMap(([key, rule]) =>
    sensitivePaths(rule, path + "/" + pointer(key)),
  );
}
/** Defaults are draft data, never a save/read-time fallback. */
export function initialValue(schema: Schema, value?: Json): Json | undefined {
  if (
    schema["x-sensitive"] === true ||
    (schema.type === "array" && sensitivePaths(schema).length)
  )
    return undefined;
  const seed = value === undefined ? schema.default : value;
  if (schema.type === "object") {
    if (
      seed !== undefined &&
      (!seed || typeof seed !== "object" || Array.isArray(seed))
    )
      return cloneJson(seed);
    const result = seed === undefined ? {} : (cloneJson(seed) as Config);
    for (const [key, rule] of Object.entries(schema.properties ?? {})) {
      const child = initialValue(
        rule,
        Object.hasOwn(result, key) ? result[key] : undefined,
      );
      if (child !== undefined) result[key] = child;
      else delete result[key];
    }
    return seed !== undefined || Object.keys(result).length
      ? result
      : undefined;
  }
  if (schema.type === "array" && Array.isArray(seed))
    return seed.map((item) => initialValue(schema.items!, item) ?? null);
  return seed === undefined ? undefined : cloneJson(seed);
}
