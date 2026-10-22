import { fileURLToPath } from "node:url";
import { expect, test } from "bun:test";
import { initialValue, messageText, assetPath } from "@picloom/package-rules";

test("draft defaults omit sensitive fields, including sensitive array items", () => {
  expect(
    initialValue(
      {
        type: "object",
        properties: {
          title: { type: "string", default: "Gallery" },
          password: { type: "string", "x-sensitive": true, default: "secret" },
          accounts: {
            type: "array",
            items: {
              type: "object",
              properties: { token: { "x-sensitive": true } },
            },
          },
        },
      },
      { accounts: [{ token: "secret" }] },
    ),
  ).toEqual({ title: "Gallery" });
});

test("package messages fall back to their author locale and assets cannot escape the archive", () => {
  expect(
    messageText(
      {
        defaultLocale: "en-US",
        messages: { "en-US": { title: "Gallery" }, zh: { title: "画廊" } },
      },
      "zh-CN",
      "title",
    ),
  ).toBe("画廊");
  expect(assetPath("../outside.png")).toBe(false);
  expect(assetPath("assets/photo.png")).toBe(true);
});

test("common package rules bundle for browsers without host or server dependencies", async () => {
  const result = await Bun.build({
    entrypoints: [fileURLToPath(import.meta.resolve("@picloom/package-rules"))],
    target: "browser",
  });
  expect(result.success).toBe(true);
  expect(result.outputs.length).toBe(1);
});
