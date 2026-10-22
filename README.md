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

The application, built-ins, default theme, protocol examples and host integration tests remain in `picloom`. Optional official extensions live in `picloom-extensions`. The theme generator owns `tools/create-theme/template/`; it no longer copies the application's default theme. Generated `dist/` files must not be edited.

## Develop

Use Linux Bun 1.4.3+. From this repository:

```sh
bun install --frozen-lockfile
bun run build
bun run typecheck
bun test ./tests
```

SDKs and tools have independent package versions. Workspace references are development dependencies; distributed tools bundle their shared implementation. Theme tools keep Vite as a peer dependency. Theme SDK remains type-only and does not pull in plugin SDK or Bun types.

## Registry dependencies and optional local integration

The application, official extensions and generated projects use exact npm versions by default. Install with `bun install --frozen-lockfile`; no sibling tooling checkout is required. The following sync workflow is only for testing unpublished source changes.

Keep the three repositories beside one another, or pass explicit target paths:

```sh
cd /root/projects/picloom-tooling
bun install --frozen-lockfile
bun run dev:sync -- ../picloom ../picloom-extensions
```

The command builds and packs all packages, copies referenced tarballs into each consumer's ignored `.local-packages/`, rewrites matching dependencies in the root and declared workspaces, and runs `bun install`. Filenames include a content hash so changing bytes cannot accidentally reuse the lockfile's previous tarball integrity. It updates manifests and lockfiles intentionally; it never publishes, commits, deletes data or restarts the host. Re-run it after changing SDK or tool code. It also accepts a generated plugin/theme project as a target. No source symlinks or cross-repository source imports are required.

Local sync temporarily creates file dependencies. Tarballs are ignored; do not use those manifests for distribution CI or Docker builds. Docker installs registry dependencies only.

After local validation, ensure the intended versions are available on npm, run `bun run dev:registry -- ../picloom ../picloom-extensions`, then run `bun install` in each consumer and verify clean installs. `dev:registry` only rewrites manifests; it does not publish. Already published versions cannot be replaced.

To test changes to creator source before publishing them:

```sh
bun tools/create-plugin/index.js /tmp/my-plugin
# Or: bun tools/create-theme/index.js /tmp/my-theme (run build first)
bun run dev:sync -- /tmp/my-plugin
cd /tmp/my-plugin
bun run typecheck
bun run build
```

Host integration checks run from `picloom`, using isolated temporary data:

```sh
bun run typecheck
bun test ./tests
bun run test:plugin-tooling
bun run test:theme-tooling
```

The last two explicitly pack the sibling tooling checkout, install generated projects outside the repositories, and test actual host installation. They need dependency download access; theme checks also need Playwright Chromium. Set `PICLOOM_TOOLING_DIR` to use a non-sibling checkout. Host protocol examples use the installed public SDK and plugin-tools packages. After updating a running preview, build its frontend and restart `picloom-dev` as needed; never run tests against preview data.

## Publishing

There is no automatic publication. Inspect package contents, validate standalone consumers, bump versions when published bytes change, and publish only with explicit authorization. Build order is package-rules and SDKs → tools → creators. Publish dependencies before consumers and update template versions after their dependencies are available. Registry versions in generated templates must not contain workspace or local file dependencies.
