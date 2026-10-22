# @picloom/plugin-tools

Build Picloom plugins with Bun 1.4.3+. The only public interface is the CLI:

```json
{
  "typecheck": "bun run --bun tsc --noEmit",
  "build": "bun --bun picloom-plugin build"
}
```

Run from the plugin directory. The tool bundles `src/index.ts` as `index.js`, checks
`plugin.json` and the default export, and writes `dist/<id>-<version>.zip` using
fflate. The ZIP contains exactly `plugin.json` and `index.js`, with limits of
20 MiB compressed and 50 MiB expanded. No system zip or Node/npm CLI is needed.
Type checking is separate. Once identity is valid, a build removes the previous
ZIP of that identity before subsequent checks, so failures cannot leave stale output.

The single entry layout is a tool convention, not a restriction on the host protocol.
Bun/Node builtins may remain external; ordinary dependencies and SDK helpers must
be bundled. Additional build outputs and runtime Sharp imports are rejected.
Use the host's `services.images.sharp`; install Sharp only for development types.

Build evaluates your entry to check identity. Keep top-level code free of network
requests and other external side effects. This is not a sandbox, and the host still
validates packages independently on installation. No programmatic API, simulator,
watch service or custom configuration is provided.

The SDK owns public protocols and runtime helpers; the creator generates projects;
this package owns compilation and ZIP creation. Install the exact version `@picloom/plugin-tools@0.1.0`.
For local validation, run `bun pm pack` in this directory after installing the main
repository's dependencies. It builds the CLI automatically and does not publish.

## 中文

`@picloom/plugin-sdk` 保留公共协议和通用运行时辅助函数；脚手架只生成初始项目；
本包提供统一构建命令 `picloom-plugin build`，不公开函数 API。
类型检查由项目单独执行。工具将源码和依赖合并，检查清单与默认导出，使用 fflate
生成只有清单与入口的 ZIP；压缩大小上限 20 MiB，解压大小上限 50 MiB。
有效身份确定后先清除同名旧包，失败不保留过期产物。无需系统 zip。

`src/index.ts` → `index.js` 是工具约定，不收紧宿主协议。Sharp 运行时使用宿主实例，
额外构建输出和未打包普通依赖被拒绝。构建会执行入口，不是沙箱，顶层代码应避免外部副作用。
宿主独立执行安装校验。本次没有模拟宿主、热更新、额外资源打包或配置扩展体系。
常规安装使用 npm 精确版本 0.1.0；本地打包仅用于验证源码修改。
