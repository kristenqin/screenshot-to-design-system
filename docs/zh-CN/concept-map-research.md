# 概念图调研

这份文档评估当前文档系统是否应该从树状侧边栏，升级为更接近 Concept Map 的图结构。

## 为什么需要它

当前项目文档已经不再是一组简单笔记。每份文档本身都代表一个项目概念：产品意图、实施计划、研究证据、操作规范、skill 审计或 Session 记忆。

树结构只能表达一个主要的 Parent-Children 路径，这对当前工作流来说偏窄。因为同一份文档经常同时承担多个角色。比如 skill 使用规范既是操作规范，也是审计材料；Session handoff 既是启动文档，也是连续性机制。

更合适的模型是图：

- 文档是节点。
- 文档关系是边。
- 导航可以按目的、语言、主题或当前任务过滤。
- 一份文档可以属于多个概念区域，不需要复制文件。

## 工具调研

| 工具 | 适配度 | 优势 | 局限 |
| --- | --- | --- | --- |
| [Markmap](https://markmap.js.org/docs/markmap) | 中 | 可以快速把 Markdown 层级转成可交互思维导图。 | 更适合单篇文档内部标题树，不适合跨文档关系图。 |
| [Obsidian Graph View](https://help.obsidian.md/plugins/graph) | 高，作为产品参考 | 把笔记当节点、内部链接当边，并支持过滤和局部图深度。 | 它是外部写作工具，不能直接嵌入当前 docs site。 |
| [Cytoscape.js](https://js.cytoscape.org/) | 高，适合后续实现 | 支持完整图模型、布局、遍历、过滤、有向图和复合图。 | 会增加依赖和实现复杂度。 |
| [Sigma.js](https://v4.sigmajs.org/) | 高，适合大图 | WebGL 渲染，内置平移、缩放、悬停交互，并连接 Graphology 算法生态。 | 更适合较大的网络探索；当前文档规模还不一定需要。 |
| [D3 Force](https://d3js.org/d3-force) | 中 | 可自定义力导向布局，并可用 SVG 或 Canvas 渲染。 | 交互、布局和可访问性都需要自己做较多工作。 |
| [React Flow](https://reactflow.dev/learn/concepts/terms-and-definitions) | 中 | 节点-边模型成熟，适合编辑型流程图和节点编辑器。 | 更适合 workflow editor，而当前站点是 vanilla JS 文档阅读器。 |

## 建议方案

采用分阶段策略。

第一阶段先做零依赖内置概念图。docs manifest 在构建时从现有文档元数据中生成图数据：

- 阅读路径成员关系生成 `organizes` 边。
- 中英双语对应文档生成 `companion` 边。
- Markdown 内部链接生成 `references` 边。

这样可以让项目马上拥有图式导航能力，同时避免把文档站点过早做成复杂可视化产品。

第二阶段在隐式图不够用时，再加入显式关系元数据。候选关系类型包括：

- `depends_on`
- `updates`
- `evidence_for`
- `implements`
- `supersedes`
- `blocks`
- `belongs_to`

第三阶段只有在图变得足够密、交互需求足够复杂时，才迁移到 Cytoscape.js 或 Sigma.js。

## 当前决策

项目现在就应该引入概念图，但实现方式要保守：

- Markdown 仍然是事实来源。
- `npm run prepare:docs` 构建时生成图数据。
- 在浏览器文档站点里渲染一个可点击的简单图。
- 用阅读路径、语言和搜索过滤控制图的复杂度。
- 在项目节点数和关系元数据还不够多之前，不引入图谱依赖。

这符合“把文档当工程”的方向：文档系统更像代码库，模块之间的关系和目录层级同样重要。
