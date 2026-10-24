# @picloom/theme-sdk

TypeScript contracts for trusted Picloom home and login themes.
Create a project with `bun create @picloom/theme@0.1.3 ./my-theme`, or install
the types with `bun add --dev @picloom/theme-sdk@0.2.0`.

```ts
import type { ThemeContext } from "@picloom/theme-sdk";

export function mount(container: HTMLElement, context: ThemeContext) {
  const unsubscribe = context.subscribe((state) => {
    container.textContent = state.site.name;
  });
  return { dispose() { unsubscribe(); container.replaceChildren(); } };
}
```

Bundle your own framework and dispose listeners and framework instances when unmounted.
The host injects runtime capabilities; do not import application-internal modules.
Theme configuration and package assets are public. Theme code is trusted and login
themes can read entered credentials; install reviewed packages only.

Use `@picloom/create-theme` for a standalone Vue project using the independently maintained
template in `tools/create-theme/template/`. Horizon in the separate `picloom-extensions/themes/horizon` project is the advanced example.

SDK snapshots and helpers are framework-independent. In Vue themes, assign each `subscribe()` snapshot to a local ref and derive computed values from that ref. Calls such as `t()`, `localized()` and `links.format()` do not establish reactive dependencies in the theme's bundled Vue runtime: do not cache their results in a computed value without explicitly depending on the relevant snapshot fields (`locale` or `copy.format`). The examples call these helpers during rendering, which is triggered by their snapshot subscription. Configuration is fixed for a mount; draft changes are picked up when a new preview is loaded.

Core errors and notifications in snapshots are translated at display time and update with the current language. Recognized error codes use core dictionaries; unknown errors preserve their original text. Themes continue to receive strings and do not need access to core translation keys. Language changes do not restart notification dismissal timers.

Signed-in themes can use `organization.list(kind, query)` and `organization.create(kind, name)`
with `kind: "tags" | "collections"` to search or create their own categories. Lists return
`{ items, total }` and support `q`, `limit` (1–100, default 50), and `offset` (default 0).
`organization.select({ tagIds, collectionIds })` updates `snapshot.organization`; each queue
entry keeps its selection from `uploads.add()` or `uploads.addUrls()`. Hide category controls
for guests. Category selection does not change the uploader or upload profile.

登录后的主题可通过 `organization.list(kind, query)` 搜索、分页，通过
`organization.create(kind, name)` 创建当前用户范围内的标签或集合；`kind` 为
`tags` 或 `collections`。`organization.select({ tagIds, collectionIds })` 更新快照中的
初始归类，上传入队时固定该选择。游客不显示归类选择；选择不会改变上传身份或配置。

## Documentation

- [Quick start](https://llleixx.github.io/picloom/development/theme-tooling.html)
- [Theme protocol and localized configuration](https://llleixx.github.io/picloom/development/themes.html)
- [Schema reference](https://llleixx.github.io/picloom/development/schema.html)
- [Messages and form hints](https://llleixx.github.io/picloom/development/package-localization.html)

## Development tools / 开发工具

This package exports types only. `@picloom/theme-tools` provides the `picloom-theme`
CLI for simulated preview, Vite builds and ZIP packaging. `@picloom/create-theme`
generates a project using both packages. Framework plugins remain in the theme's
Vite configuration; no development tools are bundled into the theme.

SDK 仅维护主题与宿主之间的公共类型协议。模拟预览、构建和 ZIP 打包由
`@picloom/theme-tools` 统一维护，脚手架负责生成项目。消费项目使用 `@picloom/theme-sdk@0.2.0`，无需引用本地源码或压缩包。
