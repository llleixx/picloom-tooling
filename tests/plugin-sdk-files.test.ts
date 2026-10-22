import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { contained, safePath } from "../plugin-sdk/files";

test("paths allow dot-prefixed names while rejecting traversal and symlinks", async () => {
  const directory = await mkdtemp(join(tmpdir(), "picloom-sdk-paths-"));
  const root = join(directory, "root");
  try {
    await mkdir(join(root, "..photos"), { recursive: true });
    const image = join(root, "..photos", "image.png");
    await writeFile(image, "image");
    expect(contained(root, "..photos/image.png")).toBe(image);
    expect(await safePath(root, "..photos/image.png")).toBe(image);
    expect(await safePath(root, "..new/image.png", true)).toBe(
      join(root, "..new", "image.png"),
    );
    expect(() => contained(root, "../outside.png")).toThrow();
    await expect(safePath(root, "..photos/../../outside.png")).rejects.toThrow();
    await symlink(directory, join(root, "linked"));
    await expect(safePath(root, "linked/outside.png")).rejects.toThrow(
      "Symbolic links are not supported",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
