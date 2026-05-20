# 导航地图调研

英文执行版见 [Navigation Map Research](../navigation-map-research.md)。

## 目的

这份文档记录将 Structure Tree 思维导图作为文档站主导航模型的调研结论。

目标不是从零再做一个导航控件，而是复用成熟交互能力，让文档系统更容易阅读，并保留浏览器前进、后退、刷新恢复等基础导航能力。

## 问题

当前文档站有两套并行导航：

- 按文档 section 分组的传统左侧目录
- 使用 Mind Elixir 渲染的 Concept Map Structure Tree

现在 Structure Tree 已经更能表达文档系统的概念层级。左侧目录仍然有用，但它和 Structure Tree 在表达两套结构，让导航心智有点分裂。

下一步要回答的问题是：

> Structure Tree 能不能成为文档站的主导航数据结构？

## 导航需求

导航模型应该支持：

- 展示导航项以及父子关系
- 打开文档叶子节点
- 聚焦、展开和折叠分支节点
- 展示从根节点到当前文档的路径
- 支持浏览器前进和后退
- 保存 URL 状态，方便刷新恢复和 session handoff
- 保留搜索和语言筛选能力
- 为小屏、可访问性或 mind-map 初始化失败保留 fallback

## 已检查候选

| 候选 | 来源 | 适配度 |
| --- | --- | --- |
| Mind Elixir | <https://docs.mind-elixir.com/docs/getting-started/intro> | 最适合继续使用，因为它已经在渲染 Structure Tree，并支持思维导图交互。 |
| Markmap | <https://markmap.js.org/docs/markmap> | 适合 Markdown 大纲思维导图，不太适合 manifest 驱动的导航数据。 |
| jsTree | <https://www.jstree.com/docs/html/> | 成熟 tree navigation widget，但会回到传统目录树。 |
| Fancytree | <https://github-wiki-see.page/m/mar10/fancytree/wiki/TutorialLoadData> | 成熟 tree widget，导航能力丰富，但视觉和心智更接近文件树。 |
| React Flow | <https://reactflow.dev/learn/concepts/terms-and-definitions> | 强大的图 UI 库，但对当前 vanilla docs site 来说迁移成本过高。 |
| Browser History API | <https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API> | 最适合处理前进、后退、URL 状态和 session history。 |

## 评估

### Mind Elixir

Mind Elixir 应继续作为主要视觉导航壳。

它已经覆盖最昂贵的交互部分：

- mind-map layout
- 分支展开和折叠
- zoom 和 pan
- 节点选择
- 只读 map 渲染

它本身不提供文档导航语义。我们仍然需要一层 adapter，负责判断：

- 哪些节点是分支
- 哪些节点是文档
- 如何打开文档
- 如何更新 URL 状态
- 刷新后如何恢复当前文档和选中节点

### Markmap

Markmap 适合作为从 Markdown 生成思维导图导航的参考。

但它不适合作为当前主实现，因为我们的文档结构不是单篇 Markdown 大纲，而是来自 `docs-manifest.json`、reading path、语言筛选和 Structure Tree 分组规则。

如果使用 Markmap，需要先从 manifest 合成 Markdown outline，再把点击映射回文档。这可行，但会增加不必要的转换层。

### jsTree 和 Fancytree

它们都是成熟的 tree navigation widget。

可以参考它们的：

- 键盘导航
- tree state persistence
- node activation events
- lazy loading patterns

但它们不适合作为本轮主方向，因为它们会把体验重新拉回传统 sidebar tree。它们能解决导航机械能力，但会丢掉 concept-map 阅读体验。

### React Flow

React Flow 很适合自定义节点和边的应用。

但它对当前文档站来说过重：

- 当前应用是 vanilla JavaScript
- Structure Tree 是层级树，不是自由编辑图
- 引入 React Flow 很可能意味着围绕 React 重新搭 UI shell

如果文档站未来变成完整 graph workspace，可以再评估。

### History API

浏览器导航应该使用原生 History API，而不是自研 history stack。

当前文档站主要使用 hash state 和 `replaceState`。如果 Structure Tree 成为导航入口，用户主动点击文档节点时应该使用 `pushState`，这样浏览器后退按钮才能回到上一份文档。

初始化、筛选器校正等非用户主动导航行为可以继续使用 `replaceState`。

## 推荐方案

推荐架构：

```text
Structure Tree data
  -> Mind Elixir renderer
  -> Navigation Adapter
  -> History API URL state
  -> Document reader
```

左侧目录不应该继续作为主心智模型。它可以转成：

- 搜索、可访问性和移动端 fallback list
- 可折叠的次级区域
- 或者在 map navigator 稳定前保留的兼容层

近期不建议立刻删除左侧目录。应该先让 Structure Tree 真正成为可用的 map navigator。

## 建议实现

### 阶段 1：Navigation Adapter

围绕 Structure Tree 节点增加一层薄 adapter：

- 点击分支节点：选中、展开/折叠并聚焦节点
- 点击文档节点：通过导航函数打开文档
- 当前节点路径：从 root 推导到当前文档的 breadcrumb
- 当前节点样式：视觉标记当前文档

### 阶段 2：URL 和 History State

把导航状态从单纯文档 hash replacement 升级为明确 route state：

```text
doc
node
lang
path
view
mapMode
```

使用：

- `history.pushState` 处理用户主动打开文档
- `history.replaceState` 处理初始化和被动状态校正
- `popstate` 恢复文档、筛选、map mode 和选中节点

### 阶段 3：弱化左侧目录

当 map navigator 可用后：

- 保留 search
- 默认折叠旧 sidebar
- 使用 map 作为主导航索引
- 为小屏和可访问性保留 list fallback

## 决策

暂时不引入新的主导航库。

继续复用 Mind Elixir 作为视觉导航表面，用浏览器 History API 处理导航历史。我们只实现一层项目特有的 adapter，把 mind-map 节点连接到文档路由。

这符合项目的 reuse-first 原则：复用通用交互引擎，只自定义项目特有的导航语义。

## 风险

- 对已知道文档名的用户来说，思维导图导航可能不如列表快。
- 如果每次展开/折叠都 push state，浏览器历史会变得太吵。
- 移动端可能需要单独的紧凑导航模式。
- 即使 map 成为主导航，可访问性仍然可能需要 list 或 tree fallback。

## 验证计划

用任务验证：

- 从 fresh session 通过 map 打开 current handoff。
- 从 Product 到 Work Plan 到 Next Tasks，再用浏览器后退返回。
- 切换中文视图，通过 map 打开文档入口。
- 搜索某个文档，从 fallback list 打开，并确认 map 仍能聚焦该文档。
- 刷新带 `doc`、`node`、`lang`、`mapMode` 的 URL，确认能恢复同一文档和 map context。

