# 工作流复盘

英文执行版见 [Workflow Retrospective](../workflow-retrospective.md)。

## 目的

这份文档复盘我们前面协作中的摩擦，并把这些摩擦转成流程升级。

本次使用的 skill：

```text
context-retrospective
```

本地路径：

```text
/Users/qyx/.codex/skills/context-retrospective/SKILL.md
```

核心原则：

> 不把问题简单归因成 agent 不够聪明，而是检查上下文、导航、边界和流程设计哪里不够。

## 主要局限

### 1. 一开始 skill 使用不可审计

现象：

- 有些 skill 先被概念性参考，后来才真正安装和读取。

影响：

- 你无法判断 agent 到底是真的用了 skill，还是凭经验模拟了 skill。

根因：

- 起初没有 skill usage policy。
- 任务没有 Required Skill 字段。
- 没有 skill usage log。

已升级：

- 新增 [Skill 使用规范](skill-usage-policy.md)。
- 新增 [Skill 使用日志](skill-usage-log.md)。
- 在任务面板中加入 Required Skill。

### 2. 项目上下文一开始依赖聊天记录

现象：

- 很多决策先存在聊天里，后来才沉淀到项目文件。

影响：

- 新 session 难以无缝恢复。

根因：

- 没有固定启动文件。
- 没有 handoff 文件。
- 没有 session resume 流程。

已升级：

- 新增 [START_HERE.md](../../START_HERE.md)。
- 新增 [Session 连续性](session-continuity.md)。
- 新增 `.codex/handoffs/current.md`。

### 3. 文档增长快于导航系统

现象：

- 文档越来越多，但一开始没有文档系统和中文入口。

影响：

- 很难判断哪份文档是入口，哪份是执行依据，哪份是产品理解层。

已升级：

- 新增 [文档系统](documentation-system.md)。
- 新增 [中文文档入口](index.md)。
- 建立中英文 companion 结构。

### 4. 任务管理一开始是隐式的

现象：

- 从想法到 PRD 到 issue 的推进很自然，但任务状态没有一开始就显式记录。

影响：

- 难以区分讨论、决策、下一步和已完成。

已升级：

- 新增 [任务面板](tasks.md)。
- 增加任务 ID、状态、依赖和 Required Skill。

### 5. Git 纪律加入得比较晚

现象：

- 文档已经很多之后才初始化 Git。

影响：

- 第一条 commit 比较大，无法追溯早期细粒度演进。

已升级：

- 初始化独立 Git repo。
- 新增 [文档工程工作流](document-engineering-workflow.md)。
- 使用 Conventional Commits。

### 6. 验证仍然偏手动

现象：

- 目前主要靠 `rg`、`find`、`git status`、人工 review。

影响：

- 对文档设置阶段够用，但进入代码实现后不够。

建议：

- 后续增加轻量 docs verification script。
- 每个实现任务都定义验证命令。

## 根因归类

### 缺少入口

没有 `START_HERE.md`、handoff、中文 index、task board 时，新 agent 和人都难以快速进入状态。

### 缺少审计轨迹

skill 是否使用、为什么这么改、改了哪些内容，一开始没有统一证据。

### 缺少角色分离

英文适合执行，中文适合理解和把控，但一开始没有明确制度化。

### 缺少阶段门

想法、PRD、issue、计划、执行、验证、提交之间需要明确门槛。

## 新工作流

以后遇到明显摩擦时，按这个循环：

```text
1. 观察摩擦
2. 归类摩擦
3. 找根因
4. 查找相关 skill
5. 读取 skill
6. 只采用适合本项目的部分
7. 更新项目工作流文档
8. 更新 skill usage log
9. review diff
10. commit
```

## 新增规则

- 非简单任务先确认任务 ID。
- 有 Required Skill 的任务必须先读 skill。
- final 前记录 skill usage。
- 英文和中文 companion 同步关键决策。
- 重要 session 结束前更新 handoff。
- 出现多轮摩擦后做 retrospective。
- 每次 retrospective 至少产生一个项目更新。

## 本次调研的 Skills

### context-retrospective

已安装并使用。

用途：

- 分析协作摩擦
- 找上下文缺口
- 把 insight 转成流程升级

### self-improvement

考虑过，但未采用。

原因：

- 初次安装失败
- 未读取本地 `SKILL.md`
- 所以不能作为已启用工作流

### verification-before-completion

建议后续安装并启用，用于实现任务完成前验证。

### project-planner

建议用于下一个任务：为 UI AST run 写实施计划。

