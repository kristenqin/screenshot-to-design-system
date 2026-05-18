# 组件聚类策略

## 目标

自动发现截图中重复或相似的 UI 区域，并把它们归为 component candidates。

第一版不要直接生成最终组件，而是输出候选、置信度和可解释属性。

## 推荐流程

```text
UI 元素检测
  -> 裁剪元素或区域
  -> 提取几何特征
  -> 提取视觉特征
  -> 提取文本特征
  -> 提取布局特征
  -> 计算相似度
  -> 聚类
  -> AI 或人工 review
  -> 确认组件定义
```

## 特征类型

### 几何特征

- 宽高
- 比例
- 面积
- 对齐关系
- 和邻居的间距
- 是否出现在列表或网格重复位置

### 视觉特征

- image embedding
- 颜色直方图
- 主色
- 边框色
- 背景色
- 圆角
- 阴影
- 图标存在性

### 文本特征

- OCR 文本
- 文本长度
- 文本角色
- text embedding
- 字号估计
- 字重估计

### 布局特征

- 子元素数量
- 排列方向
- padding
- gap
- container 关系

## 相似度公式

第一版可以使用加权相似度：

```text
final_similarity =
  0.25 * geometry_similarity
+ 0.25 * visual_embedding_similarity
+ 0.20 * color_style_similarity
+ 0.20 * layout_tree_similarity
+ 0.10 * text_role_similarity
```

## 产品决策

组件聚类第一版输出 component candidates，而不是最终组件。

这能让系统更容易调试，也能避免把相似但语义不同的元素错误合并。

