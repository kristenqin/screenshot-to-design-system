# 文档站

英文执行版见 [Docs Site](../docs-site.md)。

## 目的

项目现在包含一个本地浏览器文档站，用来把仓库里的 Markdown 文档变成更适合阅读和导航的网页。

这个站点是轻量方案：

- 不依赖前端框架
- 不需要额外安装依赖
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
```

这些是构建产物，已经被 `.gitignore` 忽略。

## 功能

- 左侧文档导航
- 按语言筛选：全部、英文、中文
- 按标题、路径、分组、摘要搜索
- Markdown 渲染
- 宽屏右侧目录
- 移动端响应式导航
- 内部 Markdown 链接尽量转成站内跳转
- Concept Map 视图，用来查看文档节点、阅读路径边、中英 companion 边和 Markdown 引用边

## 已验证

已在本地浏览器验证：

- 默认打开 `START_HERE.md`
- 导航里有 47 份文档
- 阅读路径筛选可以把导航收敛到任务相关文档
- Concept Map 视图可以渲染文档节点和关系连线
- 中文筛选可用
- 中文文档入口可打开
- 页面目录可生成

## 注意

文档站只是阅读层，不是事实来源。

事实来源仍然是：

- 根目录 Markdown
- `docs/*.md`
- `docs/zh-CN/*.md`
