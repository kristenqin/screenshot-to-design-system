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

## 2026-05-18 - `information-architecture`

任务：

- 调研可复用的模块治理资源，并落实到项目路线图。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

原因：

- 用户希望复用已有成熟实践，而不是从零发明一套 module-first 工作流。

遵循步骤：

- 读取本地 `SKILL.md`。
- 调研可复用外部框架：bounded contexts、Team Topologies、C4、ADR、Diátaxis、SLO、TRL、MVA、MVC、tracer bullets。
- 将这些框架转成项目自己的 module passport 和 readiness model。
- 更新 MVP 路线图，把 module readiness 放在 product MVP 前面。

输出：

- [模块治理优先](module-governance-first.md)
- [MVP 路线图](mvp-roadmap.md)
- [任务面板](tasks.md)

偏离：

- 没有做用户研究或外部团队访谈。
- 当前采用的是对成熟思想的轻量综合，不声称某一个框架可以单独解决整个项目问题。

验证：

- `npm run build` 成功准备 49 份文档和 287 条 graph edges。

## 2026-05-18 - `information-architecture`

任务：

- 将 module-governance-first 模型应用到文档系统本身。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

原因：

- 用户指出上一轮只是定义了治理原则，但没有把它应用到已经存在的文档模块上。

遵循步骤：

- 将文档系统视为第一个被治理的模块。
- 为它创建 module passport，明确边界、contract、verification、failure modes 和 replaceability。
- 将 passport 链接到文档系统说明、模块治理文档、README、中文入口和任务面板。
- 增加将文档系统从 M4 推进到 M5 的任务。

输出：

- [文档系统 Module Passport](module-passports/documentation-system.md)
- [文档系统](documentation-system.md)
- [模块治理优先](module-governance-first.md)
- [任务面板](tasks.md)

偏离：

- 本轮定义了 passport 和晋级门槛，但还没有加入自动化覆盖率检查。

验证：

- `npm run build` 应包含 module passport 文档，并更新浏览器站点和 Concept Map。

## 2026-05-20 - `information-architecture` + `browser`

任务：

- 用图原生第三方库替换自定义 SVG Concept Map。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`
- `/Users/qyx/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/skills/browser/SKILL.md`

原因：

- 用户反馈上一版 map 只是把文档节点放在画布上，没有清晰表达文档与文档之间的连接关系。

遵循步骤：

- 重新用“关系可读性”评估 Concept Map。
- 采用 Cytoscape.js 进行交互式图渲染。
- 保留现有 manifest graph 数据模型。
- 增加关系邻域高亮和右侧关系摘要。
- 在浏览器中完成验证。

输出：

- 更新 [概念图调研](concept-map-research.md)
- 更新 [文档站](docs-site.md)
- 更新 `src/main.js`
- 更新 `src/styles.css`
- 更新 `scripts/build-docs-content.mjs`
- 更新 `scripts/dev-server.mjs`
- 增加 `cytoscape` dependency

偏离：

- 文档站不再是零依赖。新增依赖被限制在 graph rendering。

验证：

- `npm run build` 成功准备 51 份文档和 321 条 graph edges。
- 浏览器验证确认 Cytoscape 渲染 57 个节点和 321 条边。
- 选择节点后会高亮邻域，并在右侧显示关系数量。

## 2026-05-20 - `information-architecture` + `commit-work`

任务：

- 在用户指出过早自研带来时间、Token 和维护成本后，加入复用优先发现门禁。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`
- `/Users/qyx/.codex/skills/commit-work/SKILL.md`

原因：

- 项目需要一个结构化流程规则，要求在非核心实现前先调研可复用工具、库、API、产品模式和 Skills.sh 工作流。

遵循步骤：

- 将问题作为文档系统治理规则处理，而不是一次性的备注。
- 创建中英文发现门禁文档。
- 将门禁接入项目管理、文档工程、README、中文入口、任务面板和 session handoff。
- 记录技术评估、spec-first、brainstorm 和 implementation planning 相关 Skills.sh 参考。
- 按文档工程方式准备为独立提交。

输出：

- [复用优先发现门禁](reuse-first-discovery-gate.md)
- [项目管理工作流](project-management.md)
- [文档工程工作流](document-engineering-workflow.md)
- [任务面板](tasks.md)
- [.codex/handoffs/current.md](../../.codex/handoffs/current.md)

偏离：

- 后续已处理：相关 Skills.sh 工作流现在已安装为本地 skill，或作为 audited local skill mirror 落地。
- 浏览器验证复用了现有本地文档站。

验证：

- `npm run build` 成功准备 53 份文档和 344 条 graph edges。
- 浏览器验证确认侧边栏显示 53 份文档，中文复用优先门禁页面可以打开，并显示触发条件、必须遵循的顺序和项目应用示例。

## 2026-05-20 - `skill-installer`

任务：

- 处理复用优先门禁中的偏离项：外部 Skills.sh 工作流不能只作为参考，需要安装成本地 skill。

Skill 来源：

- `/Users/qyx/.codex/skills/.system/skill-installer/SKILL.md`

原因：

- 用户希望这些工作流在后续 session 中成为本地可触发 skill，减少 agent 只按项目文档自由发挥的概率。

遵循步骤：

- 读取本地 `skill-installer`。
- 使用 helper installer 安装 GitHub-backed skills。
- 检查本地 skill 目录。
- 对不可安装或不安全的来源先做安全判断，再决定是否镜像。

输出：

- 已安装 `/Users/qyx/.codex/skills/evaluating-new-technology`
- 已安装 `/Users/qyx/.codex/skills/spec-first`
- 已安装 `/Users/qyx/.codex/skills/implementation-planner`
- 添加 audited local mirror `/Users/qyx/.codex/skills/simple-brainstorm`
- 添加 audited local mirror `/Users/qyx/.codex/skills/create-plan`
- 更新 [复用优先发现门禁](reuse-first-discovery-gate.md)

偏离：

- `simple-brainstorm` 没有直接从关联 GitHub repo 安装，因为可用的相近 repo skill 含有不可信指令；当前安装的是只保留 brainstorming workflow 的本地审计镜像。
- `create-plan` 当前无法从公开 `openai/skills` 仓库或 `npx skills add` 安装；当前安装的是基于 Skills.sh 可见工作流的本地审计镜像。

验证：

- 本地 skill 目录现在包含 `evaluating-new-technology`、`spec-first`、`implementation-planner`、`simple-brainstorm` 和 `create-plan`。

## 2026-05-20 - `information-architecture` + `browser`

任务：

- 将 Obsidian 风格交互应用到文档知识图谱。

Skill 来源：

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`
- `/Users/qyx/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/skills/browser/SKILL.md`

原因：

- 用户希望知识图谱交互更接近 Obsidian，可以查看局部图，并能控制视觉密度。

遵循步骤：

- 先运行复用优先发现门禁。
- 保留 Cytoscape.js 作为可复用图渲染器，没有重新自研渲染器。
- 将 Obsidian Graph View 作为产品参考，重点借鉴 global/local graph、filters、display controls、force controls 和 local depth。
- 在现有 manifest graph 外层增加交互控制。
- 在本地浏览器文档站完成验证。

输出：

- 更新 [概念图调研](concept-map-research.md)
- 更新 [文档站](docs-site.md)
- 更新 `src/main.js`
- 更新 `src/styles.css`

偏离：

- 没有新增图渲染依赖，因为 Cytoscape.js 已经覆盖本次需要的渲染和遍历能力。

验证：

- `npm run build` 成功准备 53 份文档和 344 条 graph edges。
- 浏览器验证确认：
  - global graph 渲染 53 个节点和 227 条主要引用边
  - local graph 在 depth 1 时收敛到 8 个节点和 20 条边
  - graph settings 暴露 4 个 toggle 和 4 个 slider
  - label toggle 可以改变节点标签透明度
