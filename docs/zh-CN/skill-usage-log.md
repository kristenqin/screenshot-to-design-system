# Skill 使用日志

英文执行版见 [Skill Usage Log](../skill-usage-log.md)。

## 2026-05-18 - `to-prd`

任务：

- 从已有研究文档生成 PRD。

Skill 来源：

- `/Users/qyx/.codex/skills/to-prd/SKILL.md`

遵循步骤：

- 读取本地 `SKILL.md`。
- 使用 required PRD sections。
- 梳理 major modules 和 deep modules。
- 加入 testing decisions。

输出：

- [PRD](prd.md)

偏离：

- 没有发布到 issue tracker，因为当前没有配置 issue tracker。

## 2026-05-18 - `to-issues`

任务：

- 把 PRD 拆成垂直 issue slices。

Skill 来源：

- `/Users/qyx/.codex/skills/to-issues/SKILL.md`

遵循步骤：

- 读取本地 `SKILL.md`。
- 使用 vertical slices。
- 标注 HITL / AFK。
- 标注依赖。
- 映射 user stories。
- 添加 acceptance criteria。

输出：

- [Issue 拆分草案](issue-breakdown-draft.md)

偏离：

- 没有创建真实 issue，因为当前没有配置 issue tracker。

## 2026-05-18 - `commit-work`

任务：

- 定义 Git 风格文档工程流程，并初始化 Git 仓库。

Skill 来源：

- `/Users/qyx/.codex/skills/commit-work/SKILL.md`

遵循步骤：

- 读取本地 `SKILL.md`。
- 初始化前检查目录状态。
- 初始化 Git repo。
- 分支改为 `main`。
- 添加 `.gitignore`。
- review staged diff。
- 创建 Conventional Commit。

输出：

- [文档工程工作流](document-engineering-workflow.md)
- 初始提交：`a52c37a docs(project): initialize screenshot-to-design-system documentation`

偏离：

- 初始仓库设置没有单独创建 feature branch。

## 2026-05-18 - `commit-work`

任务：

- 创建 skill 使用可审计机制。

Skill 来源：

- `/Users/qyx/.codex/skills/commit-work/SKILL.md`

遵循步骤：

- 编辑前检查 working tree 干净。
- 将变更限制在 skill 使用审计机制范围。
- 更新英文文档和中文 companion。
- 在任务面板中加入 Required Skill。

输出：

- [Skill 使用规范](skill-usage-policy.md)
- [Skill 使用日志](skill-usage-log.md)
- [任务面板](tasks.md)

偏离：

- 完成后无偏离。

验证：

- 已完成 diff review，并提交为 `3a210ef docs(workflow): add auditable skill usage process`。

## 2026-05-18 - `session-handoff`

任务：

- 为新 Codex session 切换到本项目建立启动和 handoff 流程。

Skill 来源：

- `/Users/qyx/.codex/skills/session-handoff/SKILL.md`

遵循步骤：

- 读取本地 `SKILL.md`。
- 借鉴 handoff 概念。
- 创建固定启动入口。
- 创建当前 handoff 文件。
- 添加新 session 启动提示词。
- 添加中英文文档。

输出：

- [START_HERE.md](../../START_HERE.md)
- [Session 连续性](session-continuity.md)
- [.codex/handoffs/current.md](../../.codex/handoffs/current.md)

偏离：

- 没有采用上游 `.claude/handoffs/` 时间戳文件结构。
- 本项目使用 `.codex/handoffs/current.md` 作为固定入口，降低新 session 恢复成本。

验证：

- 已完成 diff review，并提交为 `a2079ed docs(workflow): add session handoff startup protocol`。

## 2026-05-18 - `context-retrospective`

任务：

- 复盘前面协作中的流程摩擦，并升级项目工作流。

Skill 来源：

- `/Users/qyx/.codex/skills/context-retrospective/SKILL.md`

遵循步骤：

- 读取本地 `SKILL.md`。
- 将摩擦归类为上下文缺口、导航问题、审计缺口、任务对齐问题和指导规则问题。
- 识别根因主题。
- 把复盘结论转成新的操作规则和项目文档。
- 记录候选 skill 和采用状态。

输出：

- [工作流复盘](workflow-retrospective.md)
- [任务面板](tasks.md)

偏离：

- 项目里没有完整聊天 transcript 文件，所以本次复盘基于当前对话上下文和项目 artifacts。
- `self-improvement` 只作为候选，没有采用，因为安装失败且没有读取本地 skill。

验证：

- 本次 workflow-retrospective 变更会完成 diff review 和 commit。

## 2026-05-18 - `browser`

任务：

- 为项目文档构建并验证本地浏览器文档站。

Skill 来源：

- `/Users/qyx/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/skills/browser/SKILL.md`

原因：

- 用户希望用浏览器阅读逐渐扩大的文档系统。

遵循步骤：

- 读取 Browser skill。
- 构建本地文档站。
- 启动本地 dev server。
- 在浏览器中打开 `http://127.0.0.1:4173`。
- 验证默认页面、导航数量、中文筛选、中文入口和页面目录。

输出：

- [文档站](docs-site.md)
- `index.html`
- `src/main.js`
- `src/styles.css`
- `scripts/build-docs-content.mjs`
- `scripts/dev-server.mjs`
- `package.json`

偏离：

- `npm install` 长时间无输出，所以没有采用外部前端依赖。
- 改为零依赖本地 server 和轻量 Markdown renderer。

验证：

- IA 更新后，`npm run build` 成功准备 45 份文档。
- 浏览器验证确认文档站可渲染，中文导航可用。

## 2026-05-18 - `information-architecture`

任务：

- 审计并改进文档站导航结构。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

原因：

- 用户反馈左侧导航感觉内容混在一起，结构不够舒适。

遵循步骤：

- 读取本地 `SKILL.md`。
- 审计当前导航结构。
- 将问题归因为导航过平、心智模型不匹配、缺少 hub-and-spoke、产品/流程/审计内容混合。
- 为文档增加 reading path 元数据。
- 更新文档站导航，支持按任务路径阅读。
- 添加中英文 IA 文档。

输出：

- [信息架构](information-architecture.md)
- `src/main.js`
- `src/styles.css`

偏离：

- 尚未做真实用户 card sorting 或 tree testing。
- 本次 IA 更新基于专家复盘和用户反馈。

验证：

- `npm run build` 成功准备 45 份文档。
- 浏览器验证确认：
  - All 路径显示 45 份文档。
  - Plan 路径收敛到 14 份文档。
  - 中文路径收敛到 22 份文档，并自动切换中文语言筛选。
  - Information Architecture 已出现在导航中。

## 2026-05-18 - `information-architecture`

任务：

- 调研并实现文档系统的 Concept Map 模型。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

原因：

- 用户希望文档不只是浅层树结构，而是更像概念之间相互连接的图。

遵循步骤：

- 读取本地 `SKILL.md`。
- 将每份文档重新定义为概念节点。
- 为阅读路径、中英 companion、Markdown 引用定义关系边。
- 调研 graph / concept map 相关工具。
- 在文档站中加入零依赖 Concept Map 视图。

输出：

- [概念图调研](concept-map-research.md)
- `scripts/build-docs-content.mjs`
- `src/main.js`
- `src/styles.css`

偏离：

- 暂时没有引入 Cytoscape.js 或 Sigma.js 等依赖。
- 当前图视图是保守的项目内原型，因为文档图规模还不大。

验证：

- `npm run build` 成功准备 47 份文档并生成 graph edges。
- 浏览器验证确认 Concept Map 视图可以渲染节点和连线。
