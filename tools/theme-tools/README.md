# @picloom/theme-tools

Shared development CLI for Picloom themes. Requires Bun 1.4.4+ and Vite 8.
Install with `bun add --dev @picloom/theme-tools@0.1.1`.

```json
{
  "dev": "bun --bun picloom-theme dev",
  "build": "bun --bun picloom-theme build",
  "preview": "bun --bun picloom-theme preview"
}
```

Run from the theme directory. `dev` and `preview` accept `--port 5174`.
The CLI loads the theme's Vite configuration and framework plugins. `dev` provides
source HMR; `preview` serves existing build output. Both simulate the host, uploads
and login, and preserve `dev/config.json`, initializing it only when absent.
Real service behavior must be verified by installing the ZIP in an isolated host.

`build` runs Vite, copies public assets and LICENSE, validates the result, and writes
`dist/<id>-<version>.zip`. Type checking is a separate project command. A failed build
removes the previous ZIP for that identity once its manifest identity can be read.
The host independently validates packages on installation.

This tool supports the standard project layout: `src/entry.ts`, `public/assets/`,
`dist/package/entry.js`, and optional `style.css`. Every declared page uses `entry.js`.
These are tool conventions, not restrictions on the public theme protocol.
Vue/React/Tailwind plugins belong to the theme project. No programmatic exports,
custom tool configuration or plugin system are provided.

## 中文

`@picloom/theme-sdk` 负责协议类型，`@picloom/create-theme` 负责生成初始工程，
本包集中维护模拟宿主、热更新、预览面板、构建和 ZIP 打包，只有 CLI 公共接口。
框架及插件由主题自己的 Vite 配置决定，类型检查由主题的 `typecheck` 命令负责。

开发和产物预览分别使用 `picloom-theme dev`、`picloom-theme preview`，支持 `--port`。
配置只在首次启动时生成，保留已有 `dev/config.json`。上传、登录均为模拟，不能代替真实宿主验证。
构建使用 `picloom-theme build`，资源整理和包校验统一维护；宿主仍独立执行安装校验。
上述标准目录和单入口是本工具的工程约定，不是主题协议限制；工具使用主题自己的 Vite 配置。
