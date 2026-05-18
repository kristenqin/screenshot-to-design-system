# Skill 使用规范

英文执行版见 [Skill Usage Policy](../skill-usage-policy.md)。

## 目的

这个项目不应该只“声称使用了 skill”，而应该留下可审计证据。

当任务要求使用某个 skill 时，agent 必须记录：

- 用了哪个 skill
- skill 来源是什么
- 为什么使用
- 按了哪些步骤
- 输出了哪些 artifact
- 哪些步骤因为项目条件无法执行

## 规则

每个 Required Skill 任务都需要：

1. 任务开始前声明 skill。
2. 读取或引用本地 `SKILL.md`。
3. 按 skill 的核心流程执行。
4. 在 [Skill 使用日志](skill-usage-log.md) 里记录证据。
5. 如果跳过某些步骤，明确记录偏离原因。

## 最小记录字段

每条日志至少包含：

- 日期
- 任务 ID 或任务名
- skill 名称
- 本地路径或来源 URL
- 使用原因
- 遵循的流程步骤
- 输出 artifacts
- 偏离或跳过步骤
- 验证方式

## 任务前声明格式

```text
Required skill: <skill-name>
Skill source: <local SKILL.md path or source URL>
Why: <task-specific reason>
Expected output: <artifact path or result>
```

## 偏离记录

如果 skill 要求的某一步当前项目无法执行，必须记录。

例子：

- `to-prd` 要求发布到 issue tracker，但项目没有配置 issue tracker。
- `to-issues` 要求创建真实 issue，但当前只维护本地草案。
- `commit-work` 要求提交，但当前任务只是起草计划，暂时不需要 commit。

## 当前 skill 映射

| 工作类型 | Required skill |
| --- | --- |
| PRD 生成 | `to-prd` |
| Issue 拆分 | `to-issues` |
| 实施计划 | `project-planner` |
| 完成验证 | `verification-before-completion` |
| Git 风格文档变更或提交 | `commit-work` |
| 项目/任务流程更新 | `project-planner` 或 `commit-work` |

