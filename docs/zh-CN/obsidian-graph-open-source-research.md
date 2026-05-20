# Obsidian Graph 开源实现调研

## 目的

这份文档用于修正前面 Concept Map 工作流中的一个缺口：在继续手动调图谱效果之前，应该先调研是否已经有开源实现解决了类似问题。

目标不是避免复用，而是尽可能复用，同时把 license、架构耦合和维护风险算清楚。

## 评估问题

我们希望文档 Concept Map 更接近 Obsidian Graph View：

- 深色图谱画布
- 顺滑 pan / zoom
- hover focus 和 dimming
- local graph exploration
- visual groups
- display 和 force controls
- filter / search 行为
- 面向增长中文档图谱的稳定交互

核心问题是：

> 在继续自定义实现之前，是否应该引入、改造或借鉴已有的 Obsidian 风格开源图谱实现？

## 已检查来源

| 项目 | 来源 | License 信号 | 备注 |
| --- | --- | --- | --- |
| Obsidian Graph View | <https://help.obsidian.md/plugins/graph> | 产品参考，不是可复用源码 | 行为基准：filters、groups、display controls、forces、local graph depth。 |
| Juggl | <https://github.com/HEmile/juggl> | GPL-3.0 | 成熟 Obsidian 插件，适合作为 local graph 和 Cytoscape 方向参考。 |
| Obsidian Extended Graph | <https://github.com/ElsaTam/obsidian-extended-graph> | GPL 类仓库信号 / API 摘要中不够明确 | 适合参考 Obsidian 内部高级图谱设置。 |
| GraphFrontier | <https://github.com/pikiby/GraphFrontier> | MIT | 独立 Obsidian graph plugin，有自定义 physics/rendering，是最值得优先复用研究的候选。 |
| Obsidian Digital Garden | <https://github.com/oleeskild/obsidian-digital-garden> | MIT | 适合参考 Obsidian 内容发布形态，但不是最强图谱交互实现。 |

## 候选评估

### GraphFrontier

适配度：高，作为复用/参考候选。

为什么重要：

- MIT license。
- 是独立 graph view，不是简单包裹 Obsidian 内置 graph。
- 使用 JavaScript、自定义 canvas rendering 和自己的 physics engine。
- 源码结构小而清晰：
  - `src/render.js`
  - `src/physics.js`
  - `src/view.js`
  - `src/constants.js`
- 功能和当前项目高度相关：pin nodes、save layout、orbit layout、edge painting、hide edges、find/filter、orphan separation、physics controls。

主要限制：

- 它仍然是 Obsidian 插件，数据收集和 UI 生命周期绑定 Obsidian API。
- 直接 import 不一定干净，但 rendering 和 physics 思路非常可复用。

建议：

- 把 GraphFrontier 作为首要实现参考。
- 暂时不要整包复制进文档站。
- 先设计一个小型兼容层：
  - 从 docs manifest 到 graph model 的 adapter
  - canvas renderer module
  - physics module
  - side-panel controls
  - local graph / filter behavior

### Juggl

适配度：作为产品和 Cytoscape 交互参考很高，作为直接依赖较低。

为什么重要：

- 成熟的 Obsidian 图谱插件。
- 目标就是 advanced local graph experience。
- 比 GraphFrontier 更接近我们当前的 Cytoscape 技术方向。

主要限制：

- GPL-3.0 对商业或闭源分发风险较高。
- 实现深度绑定 Obsidian 插件环境。

建议：

- 研究交互模型，不直接复制实现。
- 特别适合参考 local graph behavior、node styling 和 graph expansion 概念。

### Obsidian Extended Graph

适配度：作为 settings 参考很高，作为直接依赖较低。

为什么重要：

- 扩展 Obsidian 原生 graph。
- 适合参考 group rules、node/edge styling、statistics-driven size 和 filtering。

主要限制：

- Obsidian plugin dependency surface 很高。
- license/reuse 友好度不如 MIT 候选。

建议：

- 作为 settings taxonomy 和 group/filter 能力参考。
- 在 license 和架构评审前，不直接 import。

### Obsidian Digital Garden

适配度：作为 docs publishing 参考中等，作为 graph interaction implementation 较低。

为什么重要：

- MIT license。
- 是发布 Obsidian-style content 的成熟生态参考。
- 和当前文档站问题有一定关系。

主要限制：

- 它不是图谱交互引擎。
- 更适合在我们想替换自研 docs site 时重新评估。

建议：

- 保留为未来 docs-site 替换候选。
- 不是下一阶段图谱交互重写主路径。

## 决策

不要继续盲目调当前 Cytoscape 图谱。

推荐路径：

1. 以 GraphFrontier 作为首要开源参考，因为它在 license、安全复用、图谱交互和实现清晰度之间最平衡。
2. 如果只是继续验证交互模型，下一小步可以暂时保留 Cytoscape。
3. 如果目标是真正贴近 Obsidian 效果，应该做一个 focused spike，把 GraphFrontier 风格 canvas rendering 和 physics 移植进文档站。
4. Juggl 和 Extended Graph 作为交互参考，不作为直接 import 对象，因为 license 和 Obsidian API 耦合风险更高。

## Build-vs-Buy 决策

Discovery gate:

- Problem：在文档站中复刻 Obsidian 风格图谱交互。
- Existing options checked：Obsidian Graph View、Juggl、Extended Graph、GraphFrontier、Digital Garden。
- Recommended path：以 GraphFrontier 为主要参考构建小型 graph module，同时保留当前 manifest data model。
- Why not pure self-build：GraphFrontier 已经解决了很多我们会重新踩一遍的交互和 physics 问题。
- Why not direct import immediately：GraphFrontier 是 Obsidian 插件，数据收集和生命周期代码需要和可复用渲染思路分离。
- Verification：做一个 spike，证明一个 canvas graph 能渲染 docs nodes、focus dimming、label threshold、pan/zoom 和 local graph behavior。
- Reversibility：graph module 继续挂在现有 `manifest.graph` 接口后面，如果 spike 失败可以切回 Cytoscape。

## 建议 Spike

创建一个独立分支或 scoped commit，只做这些事：

1. 增加 `src/graph/` 模块边界。
2. 保持 `manifest.graph` 不变。
3. 实现或适配：
   - canvas render loop
   - node radius formula
   - label zoom threshold
   - hover focus dimming
   - edge alpha and color helpers
   - simple physics loop 或静态 force layout import
4. 当前 Cytoscape view 保留为 fallback，直到 spike 验证通过。
5. 使用同样的浏览器检查验证：
   - graph 非空
   - global graph 能渲染
   - local graph 能渲染
   - hover dimming 有效
   - labels 在预期 zoom/focus 状态显示
   - desktop viewport 没有明显重叠

## 开放问题

- 如果不复制 GPL 代码，只研究交互思想，是否符合项目后续商业风险偏好？
- 下一步 spike 应该优先视觉拟真，还是交互正确性？
- saved node layout 是否应该成为 docs module contract 的一部分？
- hidden edges 和 edge painting 是否现在就暴露，还是等图谱有显式关系元数据后再做？
