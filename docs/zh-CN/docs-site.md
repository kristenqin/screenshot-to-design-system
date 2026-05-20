# 文档站

英文执行版见 [Docs Site](../docs-site.md)。

## 目的

项目现在包含一个本地浏览器文档站，用来把仓库里的 Markdown 文档变成更适合阅读和导航的网页。

这个站点是轻量方案：

- 不依赖前端框架
- 需要一次 npm install 来安装 graph dependency
- 内容从 canonical Markdown 文档生成
- 支持英文和中文文档
- 从 Markdown 链接和文档元数据生成概念图数据
- 生成文件不提交到 Git

## 本地启动

在项目根目录运行：

```bash
npm run dev
```

然后打开：

```text
http://127.0.0.1:4173
```

## 刷新内容

```bash
npm run build
```

生成内容：

```text
public/content/
public/docs-manifest.json
public/vendor/
```

这些是构建产物，已经被 `.gitignore` 忽略。

## 功能

- 两栏工作台：左侧 Structure Tree 地图导航，右侧文档阅读
- 用于搜索、小屏和可访问性的 fallback 文档列表
- 按语言筛选：全部、英文、中文
- 按标题、路径、分组、摘要搜索
- Markdown 渲染
- 宽屏右侧目录
- 移动端响应式导航
- 内部 Markdown 链接尽量转成站内跳转
- 地图导航支持两种模式：
  - Structure Tree：查看项目生命周期、模块、section、topic 和文档层级，使用 Mind Elixir 渲染
  - Relationship Graph：查看文档节点、阅读路径边、中英 companion 边和 Markdown 引用边
- Structure Tree 是默认导航视图；Relationship Graph 是关系审计视图
- Structure Tree 会统一 root、module、section、topic 和 document 五层节点命名
- Structure Tree 会把过载 section 拆成 topic group；中文工作流会拆成阅读系统、结构视图、Agent 工作流、复用规则和审计线索
- 文档叶子节点使用更短的概念标签，同时在 metadata 中保留完整文档标题
- Relationship Graph 选择节点后会高亮关系邻域，并在右侧面板总结 edge types
- Concept Map scope 切换：中文决策图、English execution graph、全量审计图
- 低价值关系会被视觉降权，让强文档引用更容易检查
- 借鉴 Obsidian 的图谱渲染：圆形节点、默认隐藏标签、hover/selection 邻域，以及更安静的画布密度
- 借鉴 Obsidian 的图谱控制：global/local view、local depth、labels、arrows、bilingual links、path links、node size、link thickness、repel force、link distance

## 已验证

已在本地浏览器验证：

- 默认打开 `START_HERE.md`
- 导航里有 59 份文档
- 阅读路径筛选可以把导航收敛到任务相关文档
- 两栏工作台会渲染 `.map-pane` 和 `.reader-pane`
- Structure Tree 通过 Mind Elixir 渲染，包含 87 个树节点、59 个可见文档，以及 10 个用于拆分 Workflow 的 topic group
- 中文 Structure Tree scope 包含 29 份文档和 46 个树节点，并移除了冗余“中文”前缀
- Relationship Graph 可以用 canvas 渲染；默认 global graph 显示 59 个文档节点和 254 条可见关系
- Local graph mode 在 depth 1 时可将当前文档邻域收敛到 8 个节点和 20 条边
- 中文和英文 graph scope 可以独立切换
- Graph settings 暴露 4 个 toggle 和 4 个 slider
- 中文筛选可用
- 中文文档入口可打开
- 页面目录可生成

## 注意

文档站只是阅读层，不是事实来源。

事实来源仍然是：

- 根目录 Markdown
- `docs/*.md`
- `docs/zh-CN/*.md`
