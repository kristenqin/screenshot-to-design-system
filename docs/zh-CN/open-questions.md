# 开放问题

## 产品问题

- 第一版输出应该是 Figma、HTML、React，还是中立 JSON？
- component candidates 是否需要用户确认后再生成设计系统？
- 什么程度的还原 fidelity 对 MVP 来说算有用？
- 目标用户优先是设计师、开发者、产品经理，还是内部自动化流程？

## 技术问题

- 哪个 UI detector 最适合目标截图类型？
- 豆包线稿在复杂企业软件截图上是否稳定？
- 线稿相对原截图是否真的提升下游检测质量？
- 哪个 embedding model 最适合 UI crop 相似度？
- 聚类应该发生在 element、region，还是 layout subtree 层级？
- 原截图和线稿检测结果冲突时如何合并？

## 组件问题

- 如何区分视觉相似但语义不同的组件？
- 如何推断 primary、secondary、disabled、danger、selected 等 variants？
- 列表/表格重复和真正组件复用如何区分？
- 什么置信度可以把候选提升为组件？

## 评估问题

- 哪种 screenshot diff 指标最符合人的判断？
- OCR diff 是否应该比 pixel diff 权重更高？
- 如何区分布局错误和颜色错误？
- 应该用哪些截图作为 regression benchmark？

