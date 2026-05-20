# 信息架构

英文执行版见 [Information Architecture](../information-architecture.md)。

## 目的

这份文档复盘当前文档站“不舒服”的原因，并定义更清晰的信息架构。

本次使用的 skill：

```text
information-architecture
```

本地路径：

```text
/Users/qyx/.codex/skills/information-architecture/SKILL.md
```

## 问题

当前文档站不是不能用，而是导航心智负担偏高。

左侧导航按这些区块分组：

- Start
- Project
- Planning
- Research
- Workflow
- 中文对应分组

这是一种“文件来源/文档类型”的组织方式，但它没有直接回答用户当下的问题。

## 根因

文档导航按系统内部结构组织，而不是按用户任务组织。

用户进入文档站时，通常想问：

- 我现在应该从哪里接着做？
- 这个项目到底是什么？
- 下一步该做什么？
- 哪些研究支撑了这个方案？
- 工作流规则在哪里？
- 哪些日志能证明之前发生了什么？

旧导航要求用户先把这些问题翻译成文件分类，所以会感觉混在一起。

## IA 诊断

### 导航过平

40 多份文档同时出现在一个侧边栏里，所有文档视觉权重接近。

### 标签偏内部视角

`Planning`、`Workflow` 这些标签有用，但不一定匹配用户当下的任务心智。

### 缺少 Hub-and-Spoke

文档很多，但缺少“阅读路径”这种上层入口。

### 产品文档和操作日志混在一起

PRD、任务、skill log、handoff、中文 companion 都在一个同等权重的列表里，导致信息密度偏高。

## 新分类

文档站现在在原有文档分组之上增加阅读路径：

| 路径 | 用户问题 | 典型文档 |
| --- | --- | --- |
| Resume | 我现在从哪里继续？ | Start Here、Handoff、Tasks |
| Understand | 这个项目是什么？ | README、PRD、Workflow Overview |
| Plan | 下一步怎么推进？ | Tasks、Issue Breakdown、Roadmap |
| Research | 方案依据是什么？ | Tools、Clustering、Tokens |
| Operate | 工作规则是什么？ | Documentation System、Skill Policy、Session Continuity |
| Audit | 之前发生了什么？ | Skill Logs、Retrospectives、Handoff |
| 中文 | 中文理解和质量把控 | 中文 companion docs |

## 实现决策

侧边栏同时支持：

- reading path filter
- language filter

原来的文档分组还保留，但它降级为二级结构。第一层应该先回答“我现在想做什么”。

## Structure Tree 内容审计

Structure Tree 的渲染形式已经足够好，接下来的瓶颈是节点内容模型。

发现的问题：

- Workflow 和中文工作流各自都有 14 个文档叶子直接挂在同一个 section 下，超过了每层 5-9 个可扫描选项的建议范围。
- 树只有四个语义层级：项目、模块、section、文档。高密度 section 需要再抽一层 topic。
- root、module、section、topic 混用了项目阶段、文件分组和操作意图，命名系统还不够统一。
- 部分顶层节点偏句子化、偏内部视角，决策扫描时不够轻。
- 文档叶子使用完整 Markdown 标题，导致树更像文件清单，而不是概念地图。
- 完整 source path 适合调试，但不适合作为可见节点内容。

已应用的调整：

- 高密度 Workflow section 改成五层：项目 -> 模块 -> section -> topic -> 文档。
- root 收敛为 Design Recovery。
- 顶层 module 改成 Entry、Product、Evidence、Operating Model、Modules。
- 文件来源 section 显示为任务域，比如 Session Entry、Product Context、Work Plan、Technical Research、Documentation Ops、Module Passport。
- Workflow 拆成 Reading System、Structure Views、Agent Workflow、Reuse Rules、Audit Trail。
- 中文工作流拆成阅读系统、结构视图、Agent 工作流、复用规则、审计线索。
- 文档叶子节点使用更短的概念标签，同时把完整文档标题保留在节点 metadata 中。
- 当用户已经处于中文语言视图时，节点和导航不再重复显示“中文”前缀；例如“中文入口”显示为“入口”，“中文项目”显示为“项目”。

这样做的目标是让树更适合做结构决策：先快速判断模块和 topic，再在需要时打开具体文档。

## 后续优化

- 为每条阅读路径做专门 hub page。
- 增加文档关系 breadcrumb。
- 显示文档元信息，比如 canonical、companion、audit、handoff。
- 对导航结构做轻量 tree testing。
- 搜索结果支持正文片段，而不是只搜标题和摘要。
