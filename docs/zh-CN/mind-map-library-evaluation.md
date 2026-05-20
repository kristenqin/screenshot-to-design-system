# 思维导图库选型评估

英文执行版见 [Mind Map Library Evaluation](../mind-map-library-evaluation.md)。

## 目的

这份文档用于修正 Structure Tree 实现过程中的问题。

当前 SVG Structure Tree 作为产品原型是有价值的，但不应该默认成为长期实现。在继续补折叠、展开、拖拽、缩放、搜索或编辑能力之前，项目应该先评估成熟库，明确哪些能力应该复用。

## 问题

当前文档站有两种 Concept Map 视图：

- Structure Tree：用于项目管理和阅读路径。
- Relationship Graph：用于耦合和引用审计。

Structure Tree 后续应该更像真正的思维导图：

- 从根概念到子概念的路径清晰
- 分支可折叠
- 支持 zoom / pan
- 支持节点聚焦和搜索
- 点击文档叶子能打开文档
- 未来可能支持拖拽排序或轻量编辑
- 文档规模增长后依然稳定

核心问题是：

> 在继续给自研 SVG tree 加功能前，是否应该替换为现成的 mind-map / tree library？

## 已检查候选

| 候选 | 来源 | 包信息 | 适配度 |
| --- | --- | --- | --- |
| Markmap | <https://markmap.js.org/> / <https://github.com/markmap/markmap> | `markmap-view@0.18.12`，MIT，依赖 D3 | 适合 Markdown 大纲转思维导图；不太适合当前 manifest 驱动的项目信息架构。 |
| Mind Elixir | <https://github.com/SSShooter/mind-elixir-core> | `mind-elixir@5.11.0`，MIT | 最值得优先 spike 的完整 mind-map core。 |
| jsMind | <https://github.com/hizzgdev/jsmind> | `jsmind@0.9.1`，BSD-3-Clause | 轻量经典 mind-map 候选，需要验证 API 和视觉适配。 |
| d3-hierarchy | <https://github.com/d3/d3-hierarchy> / <https://d3js.org/d3-hierarchy> | `d3-hierarchy@3.1.2`，ISC | 如果保留自定义 SVG renderer，它是最合适的布局引擎候选。 |
| 当前原生 SVG | 本地实现 | 无新增依赖 | 适合原型和 fallback；不适合长期继续堆功能。 |

## 评估

### Markmap

优势：

- 成熟，专注于把 Markdown 结构转换成 mind map。
- 内部使用 D3，并提供浏览器渲染包。
- 如果事实来源是一份 Markdown 大纲，非常适合。

限制：

- 当前项目事实来源不是单篇 Markdown 大纲，而是 docs manifest 和 reading-path metadata。
- 如果要干净使用 Markmap，要么从 manifest 合成 Markdown，要么绕开它最强的能力。
- 文档 metadata、中英文筛选、点击打开文档等能力仍然需要 adapter。

决策：

- 保留为视觉参考和 Markdown export 参考。
- 除非我们决定把项目信息架构转换成生成式 Markdown 大纲，否则不作为主引擎。

### Mind Elixir

优势：

- 它是完整 mind-map core，不只是布局工具。
- 很可能覆盖当前 SVG 后续需要手动补齐的大量功能：pan/zoom、分支交互、节点操作、样式和 mind-map 行为。
- MIT license 对当前项目友好。

限制：

- 它更像一个产品级组件，而不是一个很薄的布局 primitive，所以集成前必须 spike。
- 需要验证 read-only mode、自定义节点数据、点击事件、键盘行为，以及是否能贴合当前文档站样式。

决策：

- 下一步最值得优先 spike 的候选。
- 做一次 focused spike：把 `docs-manifest.json` 映射到 Mind Elixir 数据模型，并验证只读导航和折叠/展开。

### jsMind

优势：

- 轻量，专门面向浏览器 mind map。
- BSD-3-Clause license 可用。
- 如果 Mind Elixir 太重，可以作为备选。

限制：

- 视觉和 API 风格偏传统，可能需要较多适配。
- 需要验证响应式和样式质量。

决策：

- 保留为 fallback 候选。
- 只有当 Mind Elixir spike 失败或样式难以适配时再测试。

### d3-hierarchy

优势：

- 非常适合替换当前手写树布局，同时保留自定义 SVG renderer。
- 小、稳定，专门解决 hierarchical layout。
- 可以继续完全控制 markup、样式、可访问性和点击行为。

限制：

- 它是布局库，不是 mind-map 产品。
- 折叠/展开、pan/zoom、搜索、编辑仍然需要自己实现，或继续组合其他 D3 模块。

决策：

- 如果不采用完整 mind-map library，它是最佳 fallback。
- 不应继续维护当前手写布局数学，至少应该迁移到 `d3-hierarchy`。

## 推荐路径

不要继续把当前原生 SVG 实现当成长期架构来补功能。

推荐路径：

1. 保留当前 SVG Structure Tree，作为已验证原型和 fallback。
2. 做一个单 commit 的 Mind Elixir spike：
   - 新增依赖
   - 将 manifest tree data 转换成 Mind Elixir 数据
   - 渲染同样的项目生命周期树
   - 验证 collapse/expand、zoom/pan、只读点击打开文档和样式控制
3. 如果 Mind Elixir 通过验证，用一个小 adapter 替换当前原生 SVG tree。
4. 如果 Mind Elixir 不通过，再测试 `d3-hierarchy` 作为 layout-only 替代。
5. Markmap 保留为 export/reference 选项，不作为主引擎。

## Spike 验收标准

- Structure Tree 仍然默认打开。
- 树能渲染当前 SVG 原型中的生命周期分组。
- 分支可以折叠和展开。
- pan/zoom 不破坏文档站其他区域。
- 点击文档节点能打开对应 Markdown 文档。
- 语言和阅读路径筛选仍然能约束可见文档。
- 集成可以被移除，且不影响 Relationship Graph。

## 当前决策

当前原生 SVG tree 是原型，不是最终架构。

下一步实现应该先做 Mind Elixir spike，不应继续给自研 tree 追加功能。
