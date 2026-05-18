# Session 连续性

英文执行版见 [Session Continuity](../session-continuity.md)。

## 目的

当你在 Codex 里切换到新的 session，并把工作目录指向这个项目时，旧聊天历史不会自动带过去。

所以项目需要一个标准恢复流程，降低上下文恢复成本。

目标不是完全无缝，而是：

> 新 session 只读少量固定文件，就能知道项目状态、当前任务和下一步该做什么。

## Required Skill

使用：

```text
session-handoff
```

本地路径：

```text
/Users/qyx/.codex/skills/session-handoff/SKILL.md
```

## 新 Session 启动流程

新 session 指向项目路径后，先读：

1. [START_HERE.md](../../START_HERE.md)
2. [.codex/handoffs/current.md](../../.codex/handoffs/current.md)
3. [TASKS.md](../../TASKS.md)
4. 当前任务需要的 skill

然后再开始执行。

## 推荐启动提示词

```text
Please resume this project from the repository state. Start by reading START_HERE.md and .codex/handoffs/current.md, then check TASKS.md and the required skill for the current task. Do not rely on previous chat history. Record any required skill usage in docs/skill-usage-log.md.
```

## Handoff 文件

当前使用固定文件：

```text
.codex/handoffs/current.md
```

原因：

- 新 session 不需要猜哪份 handoff 最新。
- 固定入口降低恢复成本。
- Git 历史会保留它的演进过程。

## 结束 Session 时要更新什么

如果这次 session 做了有意义的变更，结束前更新：

- 当前状态
- 最新提交
- 改过的文件
- 当前任务
- 下一个任务需要的 skill
- 决策
- 阻塞
- 立即下一步
- 验证状态

