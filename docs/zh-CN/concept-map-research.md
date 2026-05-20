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
| [Cytoscape.js](https://js.cytoscape.org/) | 高，已采用 | 支持完整图模型、布局、遍历、过滤、有向图和复合图。 | 会增加依赖和实现复杂度。 |
| [Sigma.js](https://v4.sigmajs.org/) | 高，适合大图 | WebGL 渲染，内置平移、缩放、悬停交互，并连接 Graphology 算法生态。 | 更适合较大的网络探索；当前文档规模还不一定需要。 |
| [D3 Force](https://d3js.org/d3-force) | 中 | 可自定义力导向布局，并可用 SVG 或 Canvas 渲染。 | 交互、布局和可访问性都需要自己做较多工作。 |
| [React Flow](https://reactflow.dev/learn/concepts/terms-and-definitions) | 中 | 节点-边模型成熟，适合编辑型流程图和节点编辑器。 | 更适合 workflow editor，而当前站点是 vanilla JS 文档阅读器。 |

## 建议方案

采用分阶段策略。

第一阶段曾先做零依赖内置概念图。它验证了图数据模型，但没能足够清晰地表达文档与文档之间的关系。

当前实现改为使用 Cytoscape.js 渲染图。docs manifest 仍然从现有文档元数据中生成图数据：

- 阅读路径成员关系生成 `organizes` 边。
- 中英双语对应文档生成 `companion` 边。
- Markdown 内部链接生成 `references` 边。

这样可以保留 Markdown 作为事实来源，同时使用更适合图结构的渲染器来处理布局、交互和关系检查。

第二阶段在隐式图不够用时，再加入显式关系元数据。候选关系类型包括：

- `depends_on`
- `updates`
- `evidence_for`
- `implements`
- `supersedes`
- `blocks`
- `belongs_to`

如果后续图规模非常大，或需要 WebGL 级别渲染，Sigma.js 仍然是下一个候选。就当前文档图来说，Cytoscape.js 更合适，因为它更强调交互式图结构，而不只是大规模网络渲染。

## 当前决策

项目现在就应该引入概念图，但数据模型要保持保守：

- Markdown 仍然是事实来源。
- `npm run prepare:docs` 构建时生成图数据。
- 在浏览器文档站点里用 Cytoscape.js 渲染图。
- 用阅读路径、语言和搜索过滤控制图的复杂度。
- 选择节点后高亮它的关系邻域。
- 在右侧面板查看关系数量和 edge types。

这符合“把文档当工程”的方向：文档系统更像代码库，模块之间的关系和目录层级同样重要。

## 关系治理

Concept Map 不应该把所有关系都当成同等重要。图一旦过密，就会变得不可读，也会掩盖文档之间的耦合问题。

语言应该作为 graph scope 处理：

- `中文决策图`：默认用于中文 companion docs 的决策视图。
- `English execution`：面向英文源文档的执行视图。
- `All audit`：用于检查双语覆盖和跨语言关系的全量审计视图。

这样可以减少 language companion links 带来的噪声，让每类用户只检查自己真正需要的图。

关系权重：

| 关系 | 作用 | 默认视觉权重 |
| --- | --- | --- |
| `references` | 文档之间的知识关系或执行关系。 | 高 |
| `companion` | 中英文文档之间的双语映射。 | 低，主要在 audit mode 有用 |
| `path` | 阅读路径成员关系和导航辅助。 | 环境信息，audit mode 之外默认隐藏 |

图谱也应该暴露耦合信号：

- `degree`：节点参与的总关系数。
- `weighted degree`：按关系重要性调整后的关系数。
- `max degree`：当前 graph scope 中最高 degree。
- `high coupling nodes`：超过当前耦合阈值的节点数量。

高 degree 不一定是错误。它可能是合理的 hub、index 或 policy。但高 degree 必须是有意为之。如果一个普通模块文档积累了太多强关系，它可能需要拆分、转成 hub，或者定义更清楚的接口。

应用到文档图谱的软件工程原则：

- **Separation of concerns**：中文决策文档和英文执行文档应该可以分开检查。
- **High cohesion, low coupling**：文档应该有清晰职责，避免不必要的强连接。
- **Stable dependencies**：稳定的原则或 contract 文档可以被广泛引用；临时任务或日志文档不应该变成依赖中心。
- **Layered architecture**：principles、product docs、module contracts、plans、evidence、logs 不应该形成失控循环。
- **Interface segregation**：如果一份文档服务太多读者或任务，就应该拆成 explanation、how-to、reference、decision 或 audit surfaces。

## 借鉴 Obsidian 的渲染方式

Obsidian 的 Graph View 很值得作为产品参考，因为它不是把所有图信息一次性展示出来，而是把问题拆成几组控制：

- filters：控制哪些节点和链接进入图谱
- groups：用于视觉分组
- display controls：例如 arrows、text fade threshold、node size、link thickness
- force controls：例如 center force、repel force、link force、link distance
- local graph depth：用于查看更小的局部邻域

文档站应该借鉴这种交互模型：

- 节点用圆点渲染，而不是文字很重的矩形卡片。
- 标签默认隐藏，只在选中节点时展示。
- hover 或选择节点时高亮它的局部邻域。
- 弱导航边在 audit mode 之外保持环境化或隐藏。
- 布局使用更强的 repel force 和更长的 link distance，减少重叠。
- 细节放到右侧面板，让图谱画布本身保持安静。

这样图谱会更像耦合和关系检查工具，而不是试图一次性标注所有文档的图表。
