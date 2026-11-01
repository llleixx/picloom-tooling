import { expect, test } from "bun:test";
import { createPreview } from "../tools/theme-tools/src/context";

test("theme preview resolves literal package paths with the host's path rules", () => {
  const globals = {
    location: { pathname: "/", origin: "http://localhost:5173" },
    document: { documentElement: { lang: "", classList: { toggle() {} } } },
    matchMedia: () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }),
  };
  const previous = new Map(
    Object.keys(globals).map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  for (const [key, value] of Object.entries(globals))
    Object.defineProperty(globalThis, key, { configurable: true, value });
  let preview: ReturnType<typeof createPreview> | undefined;
  try {
    const manifest: Parameters<typeof createPreview>[0] = {
      id: "example.theme",
      version: "1.0.0",
      apiVersion: 1,
      defaultLocale: "en-US",
      supportedLocales: ["en-US"],
      nameKey: "name",
      messages: { "en-US": { name: "Example" } },
      pages: { home: { entry: "entry.js" } },
    };
    preview = createPreview(manifest, {}, () => {});
    for (const path of ["assets/100%.png", "assets/%23.png", "assets/登录.css"]) {
      const url = new URL(preview.ctx.asset(path));
      expect(url.origin).toBe(globals.location.origin);
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
      expect(decodeURIComponent(url.pathname)).toBe("/" + path);
    }
    for (const path of [
      "assets/a#1.png",
      "assets/a b.png",
      "../outside.png",
      "assets/a\x7f.png",
    ])
      expect(() => preview!.ctx.asset(path)).toThrow(
        "Invalid package asset path",
      );
  } finally {
    preview?.dispose();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
