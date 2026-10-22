# Picloom tooling

SDKs, build/preview tools and project generators for Picloom extension authors. This is an independent Bun workspace: building or creating a project does not require the Picloom application checkout.

[中文](README.zh-CN.md)

| Package | Source | Purpose |
| --- | --- | --- |
| `@picloom/plugin-sdk` | `plugin-sdk/` | Plugin contracts, errors and stream helpers |
| `@picloom/theme-sdk` | `theme-sdk/` | Browser-only theme types |
| `@picloom/package-rules` | `package-rules/` | Resource path rules, author-message fallback and draft defaults shared with the host |
| `@picloom/plugin-tools` | `tools/plugin-tools/` | Compile and package plugins |
| `@picloom/theme-tools` | `tools/theme-tools/` | Preview, build and package themes |
| `@picloom/create-plugin` | `tools/create-plugin/` | Generate a standalone plugin |
| `@picloom/create-theme` | `tools/create-theme/` | Generate a standalone theme |

## Create an extension

Use the npm creators directly; no checkout of this repository is required:

```sh
bun create @picloom/plugin@0.1.1 ./my-plugin
# Or create a theme
bun create @picloom/theme@0.1.1 ./my-theme
```

Enter the generated directory and run `bun install`, then `bun run typecheck` and `bun run build` separately. Themes also support `bun run dev`.

[Plugin tutorial (中文)](https://llleixx.github.io/picloom/development/plugin-tooling.html) · [Theme tutorial (中文)](https://llleixx.github.io/picloom/development/theme-tooling.html) · [Application](https://github.com/llleixx/picloom) · [Official extensions](https://github.com/llleixx/picloom-extensions)

## Develop

Use Linux Bun 1.4.3+. From this repository:

```sh
bun install --frozen-lockfile
bun run build
bun run typecheck
bun test ./tests
```

SDKs and tools have independent package versions. Workspace references are development dependencies; distributed tools bundle their shared implementation. Theme tools keep Vite as a peer dependency. Theme SDK remains type-only and does not pull in plugin SDK or Bun types.

## Local integration

To test tooling source changes, run from this repository:

```sh
bun run dev:sync -- ../picloom ../picloom-extensions
```

This builds local packages, updates consumer dependencies and installs them. You can also pass a standalone plugin or theme project. Afterwards, run `bun run dev:registry -- <target>` to restore npm dependencies, then `bun install` in the target to update its lockfile.

See [plugin tool maintenance (中文)](https://llleixx.github.io/picloom/development/plugin-tooling-maintenance.html) and [theme tool maintenance (中文)](https://llleixx.github.io/picloom/development/theme-tooling-maintenance.html).
