# PRD

英文执行版见 [PRD](../prd.md)。

## 问题陈述

用户希望从软件截图还原出可编辑设计稿和可复用设计系统，但一次性 AI 生成很难达到需要的视觉和结构精度。

问题不只是“看起来不像”。更大的问题是生成结果往往缺少真正有用的设计结构：

- 可复用组件
- design tokens
- 层级关系
- 布局规则
- 可编辑文本和区域
- 可衡量的 fidelity 反馈

当前豆包线稿生成效果已经很好，所以项目不应该把资源花在重做线稿生成上，而应该重点建设中间层：把截图和线稿转成 UI AST、component candidates、design tokens 和可重建输出。

## 解决方案

构建一个分阶段的 screenshot-to-design-system 工作流，每个阶段都产生可检查 artifact。

MVP 核心闭环：

```text
screenshot
  -> detected UI elements
  -> structured UI JSON
  -> component candidates
  -> basic design tokens
  -> reconstructed HTML
  -> visual diff report
```

第一版优先使用 HTML 作为重建目标，因为 HTML 更容易渲染、截图、diff 和调试。Figma 输出等结构稳定后再做。

## 用户故事摘要

用户需要：

- 上传或提供软件截图。
- 可选提供豆包生成的线稿。
- 查看检测到的 UI 元素 bbox。
- 将 OCR 文本链接到 UI 元素。
- 把不同 detector 输出归一化到 UI AST。
- 自动发现重复 UI 模式并生成 component candidates。
- 查看 component candidate 的 shared / variable properties。
- 提取基础 design tokens。
- 使用可视化调试器检查检测、OCR、聚类和 token 问题。
- 生成第一版 HTML 还原稿。
- 渲染重建结果并生成 diff report。
- 保存每轮实验结果，便于比较进步或退化。

## 实施决策

- MVP 阶段把豆包线稿生成当作外部黑盒能力。
- UI AST 是各阶段之间的核心契约。
- 外部工具全部通过 adapter 接入，避免绑定某个 detector。
- 每个元素都记录 source 和 confidence。
- component extraction 先输出 candidates，不直接生成最终组件。
- 第一重建目标选择 HTML，而不是 Figma。
- Figma export 暂缓到 detection、clustering、token extraction 和 diff 稳定之后。
- 聚类使用 geometry、visual、color、text、layout 多类特征。
- 字体先表达为 practical scale，不追求精确 font-family。
- 图片区域尽量排除在 token 提取之外。

## 需要建设的模块

- Schema module
- Sample dataset module
- Detector adapter module
- Feature extraction module
- Component clustering module
- Token extraction module
- Debug viewer module
- Reconstruction module
- Diff module

其中最值得做成稳定 deep module 的是：

- UI AST schema and validator
- detector output normalizer
- feature extractor
- component candidate generator
- token extractor
- diff reporter

## 测试决策

测试应该关注外部行为，而不是实现细节。

优先测试：

- UI AST schema validation
- detector output normalization
- component candidate generation
- design token extraction
- diff report generation

可视化质量无法完全靠单元测试判断，所以 debug viewer 和 screenshot diff report 本身就是验证体系的一部分。

## 不在范围内

- 自研豆包线稿生成替代品
- MVP 阶段训练自定义 UI detection model
- 精确 font-family 识别
- 无 review 的全自动设计系统生成
- 支持所有 app 类型和截图质量
- 从截图推断业务逻辑
- 在 HTML loop 稳定前优先做 Figma export

## 下一步

先创建项目结构并定义：

```text
schemas/ui-ast.schema.json
```

