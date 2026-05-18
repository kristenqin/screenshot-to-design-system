# MVP 路线图

## 路线图重构

现在这份路线图应该通过 [模块治理优先](module-governance-first.md) 来阅读。

如果底层模块还很模糊，项目不应该追求最快做出一个宽泛的端到端 MVP。更合适的路径是：

```text
module readiness first
  -> tracer-bullet integration
  -> product MVP
```

也就是说，下面每个阶段都应该先推动一个或多个模块达到明确成熟度，再把整个 screenshot-to-design 流程称为产品 MVP。

## MVP 目标

证明核心闭环：

```text
screenshot
  -> structured UI data
  -> component candidates
  -> design tokens
  -> reconstructed design
  -> visual diff
```

MVP 阶段不要替换豆包线稿生成能力。

## 阶段 1：静态截图解析

模块目标：

- 将 `Screenshot intake` 从 M1 推进到 M2。
- 将 `UI AST parsing` 从 M1 推进到 M3。

输入：

- 一张高质量截图
- 可选豆包线稿

输出：

- UI 元素
- OCR 文本
- bounding boxes
- 基础元素类型

验收：

- 主要文本区域被识别
- 主要容器和控件被识别
- 输出保存为结构化 JSON
- UI AST schema 足够明确，后续模块可以消费

## 阶段 2：组件候选发现

模块目标：

- 将 `Component clustering` 从 M1 推进到 M3。

输出：

- component candidates
- confidence score
- shared / variable properties

验收：

- 能识别重复按钮、列表项、表格行、卡片
- 不强行把噪声元素塞进聚类
- 候选结果可检查、可解释
- 聚类输出有明确 candidate contract

## 阶段 3：设计 Token 提取

模块目标：

- 将 `Design token extraction` 从 M1 推进到 M3。

输出：

- color tokens
- typography scale
- spacing scale
- radius / border tokens

验收：

- token 输出遵循稳定 schema

## 阶段 4：重建一个页面

模块目标：

- 将 `Reconstruction output` 从 M0 推进到 M3。
- 将 `Diff verification` 从 M1 推进到 M3。

优先输出 HTML，再考虑 Figma。

## 阶段 5：迭代反馈

模块目标：

- 只有参与集成的模块能清楚暴露失败时，才把第一条集成流推进到 M6。

使用：

- pixel diff
- OCR diff
- bbox diff
- color distance
- layout mismatch

目标是第二轮生成能比第一轮更接近原截图。
