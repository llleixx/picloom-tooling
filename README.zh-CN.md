# Picloom 工具链

独立维护插件和主题 SDK、开发工具与脚手架，使用 Bun workspace 管理。构建工具链或创建扩展项目不需要 Picloom 主仓库源码。

[English](README.md)

| 目录 | 包 | 职责 |
| --- | --- | --- |
| `plugin-sdk/` | `@picloom/plugin-sdk` | 插件公共协议、错误和文件辅助函数 |
| `theme-sdk/` | `@picloom/theme-sdk` | 浏览器主题类型，保持纯类型入口 |
| `package-rules/` | `@picloom/package-rules` | 宿主与工具需保持一致的资源路径、作者文案回退和草稿默认值规则 |
| `tools/plugin-tools/` | `@picloom/plugin-tools` | 插件构建及 ZIP 打包 |
| `tools/theme-tools/` | `@picloom/theme-tools` | 主题预览、构建及 ZIP 打包 |
| `tools/create-plugin/` | `@picloom/create-plugin` | 插件工程生成 |
| `tools/create-theme/` | `@picloom/create-theme` | 主题工程生成 |

## 创建扩展项目

常规开发直接使用 npm 脚手架，不需要 clone 本仓库：

```sh
bun create @picloom/plugin@0.1.2 ./my-plugin
# 或创建主题
bun create @picloom/theme@0.1.2 ./my-theme
```

进入生成目录运行 `bun install`，再分别执行 `bun run typecheck` 和 `bun run build`；主题还可运行 `bun run dev`。

[插件教程](https://llleixx.github.io/picloom/development/plugin-tooling.html) · [主题教程](https://llleixx.github.io/picloom/development/theme-tooling.html) · [应用仓库](https://github.com/llleixx/picloom) · [官方扩展](https://github.com/llleixx/picloom-extensions)

## 开发

使用 Linux 中的 Bun 1.4.3+：

```sh
bun install --frozen-lockfile
bun run build
bun run typecheck
bun test ./tests
```

各包独立维护版本。workspace 依赖用于工具链开发，工具分发包包含共用实现；主题工具将 Vite 保留为 peer dependency。主题 SDK 不依赖插件 SDK 或 Bun 类型。

## 本地联调

验证工具链源码改动时，在本仓库执行：

```sh
bun run dev:sync -- ../picloom ../picloom-extensions
```

命令构建本地包、更新目标仓库依赖并安装，也可传入独立插件或主题项目路径。验证后运行 `bun run dev:registry -- <目标目录>` 恢复 npm 依赖，再在目标目录执行 `bun install` 更新锁文件。

工具维护细节见[插件工具维护](https://llleixx.github.io/picloom/development/plugin-tooling-maintenance.html)和[主题工具维护](https://llleixx.github.io/picloom/development/theme-tooling-maintenance.html)。
