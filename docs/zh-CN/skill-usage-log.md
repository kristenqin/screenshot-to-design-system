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
