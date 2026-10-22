# @picloom/create-theme

Create a standalone Vue 3 Picloom theme with Bun 1.4.3+, simulated preview,
component/style HMR and ZIP packaging. No application checkout, Node/npm CLI or
system `zip` is required.

Create a project:

```sh
bun create @picloom/theme@0.1.1 ./my-theme
cd my-theme
bun install
bun run dev
bun run build
bun run preview
```

The target must not exist; its parent must exist. The creator copies files only;
it does not install dependencies, initialize Git or publish. Both home and login
pages start from the template maintained in this package.
`--help` prints usage.

To test local packages, use the `.tgz` workflow in
[theme tooling](https://llleixx.github.io/picloom/development/theme-tooling.html).
Maintainers run `bun run build:create-theme` before `bun pm pack --ignore-scripts`.
The build copies `template/` into `dist/template/` without reading the host repository. Preview and ZIP builds are provided
by `@picloom/theme-tools`; generated projects do not contain a copy of the preview host.
Do not edit `dist/template/`. Use exact npm version 0.1.1.

## 中文

基于工具链仓库独立维护的模板创建 Vue 3 主题。提供模拟预览、热更新、生产产物预览与 ZIP 打包。
创建工具只复制文件，不覆盖已有目录、不安装依赖、不初始化 Git、不发布。
模拟预览不连接真实服务；上传、登录与权限必须在隔离测试实例安装后验证。
通过 npm 创建项目，也可按文档使用本地 `.tgz` 验证开发版本。编辑 `template/` 维护模板，构建时复制到 `dist/template/`，不依赖主仓库默认主题源码。

协议类型来自 `@picloom/theme-sdk`，预览与构建调用 `@picloom/theme-tools`；生成项目不复制通用工具代码。
