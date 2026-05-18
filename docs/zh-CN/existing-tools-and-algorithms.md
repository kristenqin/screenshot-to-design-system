# 现成工具与算法

## 原则

不要每个环节都从零实现。当前策略应该是：

> 成熟能力拼装 + 少量关键胶水层自研。

## 不建议重做

### 线稿生成

继续使用豆包生图 API，除非找到明显更便宜、质量接近且稳定的替代方案。

## 值得复用的能力

### OCR

候选：

- PaddleOCR
- Tesseract
- 云 OCR API
- 多模态模型 OCR

### UI 元素检测

候选：

- UIED
- uitag
- YOLO UI detection model
- deki

这些工具可以输出 bbox、元素类型和基础结构信息。

### 视觉相似度

可以复用：

- perceptual hash：找近似重复元素
- SSIM：比较 crop 的视觉相似度
- CLIP / SigLIP：语义相似
- DINOv2 / ViT：视觉结构相似
- color histogram：风格相似
- OpenCV template matching：固定图标或重复 UI 区块

### 聚类

候选：

- DBSCAN
- HDBSCAN
- Agglomerative Clustering
- k-means

MVP 优先考虑 DBSCAN / HDBSCAN，因为组件组数量未知，而且会有噪声点。

## 仍然需要自研的部分

- UI AST schema
- 外部工具输出归一化
- 相似度加权规则
- component candidate 合并逻辑
- token 抽取规则
- 页面重建逻辑
- diff 反馈循环

