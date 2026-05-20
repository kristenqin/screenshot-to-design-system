# 任务面板

这是项目的中文任务入口。英文执行版见 [TASKS.md](../../TASKS.md)。

## 当前焦点

项目正在从研究文档进入实现规划阶段。

当前最重要的下一步是：

> 创建第一个 validated UI AST run。

## Next

| ID | 任务 | 类型 | Required Skill | 依赖 | 来源 |
| --- | --- | --- | --- | --- | --- |
| T-001 | 确认或调整 issue 垂直切片拆分 | HITL | `to-issues` | 无 | [Issue 拆分草案](issue-breakdown-draft.md) |
| T-002 | 创建第一个 validated UI AST run | AFK | `project-planner`, `verification-before-completion` | 建议先完成 T-001 | [Issue 1](issue-breakdown-draft.md) |
| T-003 | 为 UI AST run 写实施计划 | AFK | `project-planner` | T-001 | [项目管理工作流](project-management.md) |
| T-014 | 维护 skill 使用规范和审计日志 | AFK | `commit-work` | 无 | [Skill 使用规范](skill-usage-policy.md) |
| T-022 | 维护复用优先发现门禁 | AFK | `information-architecture`, `commit-work` | 无 | [复用优先发现门禁](reuse-first-discovery-gate.md) |
| T-023 | Spike GraphFrontier 风格图谱渲染 | AFK | `evaluating-new-technology`, `information-architecture`, `browser`, `commit-work` | T-019 | [Obsidian Graph 开源实现调研](obsidian-graph-open-source-research.md) |

## Backlog

- T-004：把 OCR 输出归一化为 UI AST text runs
- T-005：比较原截图和线稿两种检测输入
- T-006：为一个样例构建可视化调试器
- T-007：从重复 fixture 元素生成 component candidates
- T-008：在调试器里展示 component candidates
- T-009：从一个样例提取基础 design tokens
- T-010：从 UI AST 生成第一版 HTML 还原稿
- T-011：渲染还原稿并生成 diff report
- T-012：打包第一条完整 demo run

## 已完成

- 初始流程研究
- 现成工具和算法调研
- 组件聚类策略
- 设计 token 提取策略
- 使用 `to-prd` 生成 PRD
- 使用 `to-issues` 生成 issue 拆分草案
- 调研 Skills.sh 项目管理 skills
- 建立 skill 使用可审计机制
- 加入复用优先发现门禁
- 调研 Obsidian 风格开源图谱实现

## 规则

- 优先做能产生可验证 artifact 的垂直切片。
- 开始或完成任务时更新任务状态。
- 复杂任务的详细计划放到 `docs/plans/`。
- MVP 阶段继续把豆包线稿生图当作外部黑盒能力。
- 如果任务声明了 Required Skill，必须在 [Skill 使用日志](skill-usage-log.md) 中记录实际使用证据。
- 在非核心实现前，先运行 [复用优先发现门禁](reuse-first-discovery-gate.md)，记录复用或自研决策。
