# @picloom/package-rules

Browser-safe rules that must agree between Picloom's host and standalone theme tools:

- `safeName`, `assetPath`: package resource identity and path constraints.
- `messageText`: author-owned message lookup with the same locale fallback order.
- `initialValue`: schema defaults used to create editor/preview drafts, not defaults applied when saving or reading data.

This package is not a general utility collection or the plugin SDK. Product language lists, host declaration validation, form label assembly and secret-path discovery belong to their consumers. JSON copying, pointer formatting and traversal needed by draft generation are private implementation details. Similar implementation code alone is not a reason to add an export.

No host, database, Bun or Node runtime dependency. Public plugin and theme contracts remain in their respective SDK packages.

## 中文

仅统一宿主与独立主题工具必须一致的行为：资源标识与路径约束、作者文案的语言回退顺序、配置编辑和预览的草稿默认值生成。默认值不在保存或读取时补入数据。

本包不是通用工具函数集合，也不是插件 SDK。产品语言列表、宿主声明校验、字段文案组装和敏感路径扫描留在使用方；草稿算法所需的复制与遍历函数保持私有。不能仅因代码相似就新增公共导出。
