# My Picloom plugin

A date-path plugin project for Bun 1.4.4+.

## Develop

```sh
bun install
bun run typecheck
bun run build
```

- `plugin.json`: set your plugin ID and version.
- `src/index.ts`: edit localized names, configuration and path generation. The starter uses UTC dates and accepts empty configuration `{}`.
- `package.json`: dependencies and commands. Type checking runs separately from builds.
- `dist/<plugin-id>-<version>.zip`: the built plugin, containing the manifest and bundled entry.

Builds load the entry, so keep module-level code free of external side effects. Use `services.images.sharp` for runtime image processing; the Sharp dependency supplies development types.

## Install

As Owner, upload the ZIP in Picloom plugin management. Select the plugin in an upload profile with an available storage group, then upload an image and open its link.

After changes, increment `plugin.json.version`, rebuild and install. Select the new version in the upload profile and apply the migration preview; existing configurations do not switch automatically.

[Plugin tutorial](https://llleixx.github.io/picloom/development/plugin-tooling.html) · [Packaging and upgrades](https://llleixx.github.io/picloom/development/plugin-release.html)

## 中文

使用 Bun 1.4.4+，依次运行上方安装、类型检查和构建命令。

- `plugin.json`：修改插件 ID 与版本。
- `src/index.ts`：修改多语言名称、配置与路径生成。初始实现使用 UTC 日期，接受空配置 `{}`。
- `package.json`：依赖与命令，类型检查和构建分别执行。
- `dist/<插件ID>-<版本>.zip`：包含清单与打包入口的安装包。

构建会加载入口，避免在模块顶层执行远端操作。图片处理使用宿主的 `services.images.sharp`；Sharp 开发依赖用于类型检查。

以 Owner 在插件管理中安装 ZIP，在上传配置中选择插件并关联可用存储组，上传图片后打开返回链接。更新时增加清单版本、重新构建安装，再在上传配置中选择新版并应用迁移预览；已有配置不会自动切换。
