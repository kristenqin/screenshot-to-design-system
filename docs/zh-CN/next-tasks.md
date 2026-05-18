# 下一步任务

## 目的

把当前产品讨论转成可执行任务。

当前不是要一次性做完整产品，而是证明第一条可靠闭环：

```text
screenshot
  -> detected UI elements
  -> structured UI JSON
  -> component candidates
  -> basic design tokens
  -> reconstructed HTML or design draft
  -> screenshot diff
```

## 任务组

1. 定义中间数据结构
2. 准备小型截图数据集
3. 跑 UI detection 和 OCR 实验
4. 构建可视化调试页
5. 原型化 component candidate clustering
6. 提取基础 design tokens
7. 生成第一版重建输出
8. 加入 screenshot diff 反馈

## 建议节奏

第 1 周：

- 定义 schemas
- 准备截图样例
- 在 3 张截图上跑 OCR 和 UI 检测

第 2 周：

- 把检测结果归一化到 UI AST
- 构建可视化调试页
- 比较原截图检测和线稿检测

第 3 周：

- 实现 component candidate clustering
- 增加 crop feature extraction
- 在重复 UI 模式上调参

第 4 周：

- 提取基础 tokens
- 生成 HTML
- 渲染截图并生成 diff report

## 当前最推荐的第一步

创建：

```text
schemas/
experiments/
samples/
tools/
viewer/
```

然后实现：

```text
schemas/ui-ast.schema.json
```

