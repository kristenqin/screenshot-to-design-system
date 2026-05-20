# 导航交互调研

英文执行版见 [Navigation Interaction Research](../navigation-interaction-research.md)。

## 目的

这份文档记录两栏文档工作台上线后，对地图导航交互继续优化的调研结论。

目标是让 map navigator 更像可用的 ToB 文档工作台，而不是一个占空间很大的视觉原型。

## 发现的问题

- 筛选区域占用了过多左侧地图空间。
- Reading path 筛选的视觉重量过高，和实际使用频率不匹配。
- 点击地图叶子节点后，鼠标交互有粘滞感。
- 当前访问文档在思维导图中的位置不够清晰。
- 导航状态仍主要是 document hash replacement，对浏览器前进和后退支持不完整。

## 参考对象

| 参考 | 可复用模式 |
| --- | --- |
| [Stripe Docs](https://docs.stripe.com/) | 搜索保持明显，导航分类紧凑且任务导向。 |
| [Microsoft Learn](https://learn.microsoft.com/) | 筛选用 compact chips / dropdown，避免干扰阅读焦点。 |
| [Atlassian Design System](https://atlassian.design/) | ToB 导航强调高密度控件、breadcrumb 和清晰 active state。 |
| [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) | 用户主动导航用 `pushState`，被动校正用 `replaceState`，通过 `popstate` 恢复前进/后退状态。 |
| [Mind Elixir API](https://docs.mind-elixir.com/docs/api/) | 保留 Mind Elixir 作为地图渲染引擎，在本项目适配文档打开、active node 标记和 pointer cleanup。 |

## 设计方向

### 筛选

使用渐进式密度：

- search 保持可见
- reading path 压缩成小 chip
- language 保留为紧凑 segmented control
- 不在常驻 map pane 中使用大卡片式筛选

左侧面板的大部分高度应该给思维导图，因为它才是主导航对象。

### 地图节点交互

思维导图应该表现为导航，而不是编辑器：

- 文档叶子打开右侧 reader
- 分支节点保留选择和展开能力
- 文档叶子打开后释放 pointer state
- 当前文档节点应该有清晰 active 样式
- 当前文档节点可见时，地图面板应尽量滚动到它附近

### History State

Route state 应包含：

```text
doc
lang
path
mapMode
```

使用：

- 用户主动打开文档时 `pushState`
- 初始化、搜索输入、被动筛选校正时 `replaceState`
- 通过 `popstate` 恢复 document、language、path 和 map mode

Search 不应该在每次输入时 push 浏览器历史。

## 推荐

先实现 compact filter bar 和 route-state adapter，再继续增加地图能力。

这样可复用边界清晰：

- Mind Elixir：视觉地图引擎
- History API：浏览器导航语义
- local adapter：项目特有 route 和 active-node 行为

## 验收标准

- 筛选控件比第一版 workbench 占用更少垂直空间。
- 首屏能直接看到主要地图区域。
- 当前文档节点在地图中可见时有明显 active 样式。
- 点击文档叶子能打开文档，并且不会出现明显鼠标粘滞状态。
- 浏览器前进和后退能恢复文档路由状态。
