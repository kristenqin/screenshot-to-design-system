# MVP 路线图

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

## 阶段 2：组件候选发现

输出：

- component candidates
- confidence score
- shared / variable properties

验收：

- 能识别重复按钮、列表项、表格行、卡片
- 不强行把噪声元素塞进聚类
- 候选结果可检查、可解释

## 阶段 3：设计 Token 提取

输出：

- color tokens
- typography scale
- spacing scale
- radius / border tokens

## 阶段 4：重建一个页面

优先输出 HTML，再考虑 Figma。

## 阶段 5：迭代反馈

使用：

- pixel diff
- OCR diff
- bbox diff
- color distance
- layout mismatch

目标是第二轮生成能比第一轮更接近原截图。

