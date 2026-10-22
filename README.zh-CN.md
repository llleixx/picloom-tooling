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

`picloom` 保留前后端、必要内置插件、默认主题、协议示例及宿主集成测试；`picloom-extensions` 维护官方可选插件和主题。主题脚手架独立维护 `tools/create-theme/template/`，不再在构建时复制主仓库默认主题。不要直接编辑生成的 `dist/`。

## 开发

使用 Linux 中的 Bun 1.4.3+：

```sh
bun install --frozen-lockfile
bun run build
bun run typecheck
bun test ./tests
```

各包独立维护版本。workspace 依赖用于工具链开发，工具分发包包含共用实现；主题工具将 Vite 保留为 peer dependency。主题 SDK 不依赖插件 SDK 或 Bun 类型。

## npm 依赖与可选本地联调

主程序、官方扩展和生成的工程默认引用 npm 精确版本，直接运行 `bun install --frozen-lockfile` 即可。下面的本地同步仅用于验证尚未发布的源码修改，不是日常安装步骤。

默认将三个仓库并排放置，也可指定其他目标路径：

```sh
cd /root/projects/picloom-tooling
bun install --frozen-lockfile
bun run dev:sync -- ../picloom ../picloom-extensions
```

命令构建并打包工具链，将被引用的压缩包复制到目标仓库的 `.local-packages/`，更新根目录及 workspace 中的依赖，然后执行 `bun install`。文件名包含内容哈希，避免同名压缩包覆盖后仍沿用旧锁文件校验和。修改 SDK 或工具后重新运行即可；也支持将独立插件或主题工程作为目标。

同步会修改目标仓库的 `package.json` 和 `bun.lock`，不发布、不提交、不重启宿主、不操作数据；不使用跨仓源码相对路径或软链接。压缩包由 Git 忽略；本地同步后的清单不能用于分发 CI 或 Docker 构建。Docker 只安装 registry 依赖。

本地验证结束后，先确认目标版本已在 npm 可用，再恢复正式依赖：

```sh
bun run dev:registry -- ../picloom ../picloom-extensions
```

该命令只将依赖恢复成精确 registry 版本，不发布也不安装。之后分别在消费仓库运行 `bun install` 更新锁文件，并验证干净安装。已发布版本不能覆盖；发布前检查是否需要递增版本。

验证脚手架的源码修改时，也可以直接生成工程并同步本地依赖：

```sh
bun tools/create-plugin/index.js /tmp/my-plugin
# 主题：先构建，再运行 bun tools/create-theme/index.js /tmp/my-theme
bun run dev:sync -- /tmp/my-plugin
cd /tmp/my-plugin
bun run typecheck
bun run build
```

宿主集成验证仍从 `picloom` 执行，使用隔离临时数据：

```sh
bun run typecheck
bun test ./tests
bun run test:plugin-tooling
bun run test:theme-tooling
```

后两项显式打包相邻的 tooling 仓库，在仓库外生成工程并验证真实宿主安装，需要依赖下载网络；主题验证还需要 Playwright Chromium。非相邻目录通过 `PICLOOM_TOOLING_DIR` 指定。主仓库协议示例使用已安装的公共 SDK 与 plugin-tools 包。

更新预览时按需构建主仓库前端并重启 `picloom-dev`；自动化测试不使用预览数据。

## 发布边界

不自动发布。先检查包内容、验证独立工程，再按明确授权发布。构建顺序为公共规则及 SDK → 工具 → 脚手架；发布时先确保依赖版本可下载，再更新模板并发布脚手架。生成模板只引用精确 registry 版本，不能带 workspace 或本地文件依赖。
