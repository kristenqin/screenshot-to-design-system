# Issue 拆分草案

英文执行版见 [Issue Breakdown Draft](../issue-breakdown-draft.md)。

这份文档基于 `to-issues` skill，把 PRD 拆成可独立领取的垂直切片。

当前没有配置 issue tracker，所以这些是本地草案。

## 垂直切片

### 1. Create the First Validated UI AST Run

类型：AFK

依赖：无

目标：

从一个样例截图到一个通过校验的 UI AST JSON，跑通第一条 artifact 路径。

验收：

- 样例截图能被注册到项目结构。
- 有最小 UI AST schema。
- fixture UI AST 能通过校验。
- 无效 fixture 会给出有用错误。
- 每个元素记录 source 和 confidence。

### 2. Normalize OCR Output Into UI AST Text Runs

类型：AFK

依赖：Issue 1

目标：

把 OCR-like 输出归一化为 UI AST text runs。

### 3. Compare Screenshot and Wireframe Detection Inputs

类型：HITL

依赖：Issue 1

目标：

支持原截图和豆包线稿作为两种输入，并记录来源差异，方便判断线稿是否提升结构检测。

### 4. Build the Visual Debug Viewer for One Sample

类型：AFK

依赖：Issue 1 和 2

目标：

构建一个能显示截图、bbox、OCR 文本和元素详情的调试视图。

### 5. Generate Component Candidates From Repeated Fixture Elements

类型：AFK

依赖：Issue 1

目标：

用 fixture UI AST 数据生成第一版 component candidates。

### 6. Visualize Component Candidates in the Debug Viewer

类型：AFK

依赖：Issue 4 和 5

目标：

在调试器里用颜色和详情展示 component candidates。

### 7. Extract Basic Design Tokens From One Sample

类型：AFK

依赖：Issue 1

目标：

从样例提取基础 colors、typography、spacing、radius、border、shadow tokens。

### 8. Generate First HTML Reconstruction From UI AST

类型：AFK

依赖：Issue 1、5、7

目标：

基于 UI AST、component candidates 和 tokens 生成第一版 HTML 重建结果。

### 9. Render Reconstruction and Produce a Diff Report

类型：AFK

依赖：Issue 8

目标：

把 HTML 渲染为图片，并与源截图生成 diff report。

### 10. Package the First Demo Run

类型：HITL

依赖：Issue 1 到 9

目标：

打包一条完整 demo run，并总结当前最薄弱环节。

## 需要你确认的问题

- 粒度是否合适？
- 依赖关系是否合理？
- 哪些 issue 应该合并或继续拆分？
- HITL / AFK 标记是否符合预期？

