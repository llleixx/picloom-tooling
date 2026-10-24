# @picloom/plugin-sdk

Public TypeScript interfaces and runtime helpers for Picloom plugins. Maintained
in the independent [picloom-tooling](https://github.com/llleixx/picloom-tooling)
workspace; plugin authors do not need an application or tooling checkout.

Install from npm with Bun:

```sh
bun add --dev @picloom/plugin-sdk@0.2.0 sharp@0.34.5
```

```ts
import { PluginError, type Definition } from "@picloom/plugin-sdk";
```

Use ESM with TypeScript `moduleResolution: "Bundler"` and Bun types. The SDK
contains types for `path`, `storage`, and `processor` plugins, configuration,
host services, errors, and file/stream helpers. It does not start Picloom.

Use the host's `services.images.sharp` at runtime. Install Sharp as a development
dependency for its public types; do not bundle a second native runtime. Bundle
SDK runtime helpers with the plugin. Picloom does not install dependencies from ZIPs.

## Documentation

- [Quick start](https://llleixx.github.io/picloom/development/plugin-tooling.html)
- [Configuration and parameters](https://llleixx.github.io/picloom/development/plugin-config.html)
- [Host services](https://llleixx.github.io/picloom/development/plugin-services.html)
- [Schema reference](https://llleixx.github.io/picloom/development/schema.html)
- [Messages and form hints](https://llleixx.github.io/picloom/development/package-localization.html)

## 中文

本包提供插件类型和辅助函数，不包含 Picloom 服务。通过 npm 安装，开发流程见
[快速开始](https://llleixx.github.io/picloom/development/plugin-tooling.html)。

安装和导入方式见上方示例，使用 Bun 1.4.4+。

运行时使用 `services.images.sharp`；Sharp 开发依赖用于类型检查，不将另一套原生库打入插件。
SDK 辅助函数随插件打包，Picloom 不会安装 ZIP 中声明的依赖。插件以 ZIP 分发，无需发布到 npm。

配置、密钥、Schema 和多语言规则统一查阅上方文档链接。
