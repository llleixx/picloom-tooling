# @picloom/create-plugin

Create a standalone Picloom date-path plugin with Bun 1.4.4+.

```sh
bun create @picloom/plugin@0.1.2 ./my-plugin
cd my-plugin
bun install
bun run typecheck
bun run build
```

The target directory must not exist and its parent must exist. Follow the generated README to edit and install the ZIP. The starter generates paths using UTC dates. Type checking and building are separate commands.

[Plugin tutorial](https://llleixx.github.io/picloom/development/plugin-tooling.html)

## 中文

使用 Bun 1.4.4+ 创建独立日期路径插件。按上方命令创建工程、安装依赖、检查类型并构建。目标目录必须不存在，父目录必须存在。

初始插件按 UTC 日期生成路径。类型检查与构建分别执行；修改文件和安装 ZIP 的步骤见生成项目中的 README。
