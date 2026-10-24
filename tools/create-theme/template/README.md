# Picloom theme / 主题开发

A Vue 3 theme for Picloom home and login pages. Requires Bun 1.4.4+.

## Develop

```sh
bun install
bun run dev
```

Open `http://127.0.0.1:5173/`; use `bun run dev --port 5174` to change the port. The preview panel simulates pages, languages, appearance, login and upload states.

- `theme.json`: theme ID, version, localized text and configuration schema.
- `src/Page.vue`, `src/style.css`: pages and styles, with hot updates.
- `src/OrganizationPicker.vue`: signed-in tag and collection selection for new uploads.
  登录用户可为新上传选择标签和集合，归类在入队时固定。
- `src/entry.ts`: mounts the theme and disposes it on unmount.
- `public/assets/`: package resources, read with `context.asset("assets/...")`.
- `dev/config.json`: created on first preview from schema defaults; edit it to try configuration values. New defaults do not replace existing values.

Keep `style.css` in the manifest's global `styles`; it contains CSS imported by the entry. Configuration and packaged resources are public.

## Build and install

```sh
bun run typecheck
bun run build
bun run preview
```

Type checking is separate. `preview` displays the existing `dist/package/` through the simulated host; rebuild to see source changes.

Install `dist/<theme-id>-<version>.zip` as Owner in Picloom's Themes page, configure, preview and apply. Check uploads and login there. Increment `theme.json.version` before installing changed content; an installed ID/version cannot be overwritten.

[Theme tutorial](https://llleixx.github.io/picloom/development/theme-tooling.html) · [Theme protocol](https://llleixx.github.io/picloom/development/themes.html)

## 中文

使用 Bun 1.4.4+。运行 `bun install` 和 `bun run dev`，打开 `http://127.0.0.1:5173/`；可用 `--port 5174` 更换端口。面板模拟页面、语言、外观、登录与上传状态。

- `theme.json`：主题 ID、版本、多语言文案与配置 Schema。
- `src/Page.vue`、`src/style.css`：页面与样式，支持热更新。
- `src/entry.ts`：挂载主题并在卸载时清理资源。
- `public/assets/`：包内资源，通过 `context.asset("assets/...")` 读取。
- `dev/config.json`：首次预览按 Schema 默认值创建，之后手动修改；新默认值不会覆盖已有配置。

入口导入的 CSS 合并到 `style.css`，需保留清单中的全局样式声明。主题配置与包内资源可公开访问。

分别执行 `bun run typecheck`、`bun run build`。`bun run preview` 模拟预览已有构建产物，修改源码后需重新构建。

以 Owner 在 Picloom 主题管理中安装 `dist/<主题ID>-<版本>.zip`，配置、预览并应用，再检查上传和登录。更新时增加 `theme.json.version`；同 ID、同版本不能覆盖。
