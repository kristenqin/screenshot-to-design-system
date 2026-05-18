# Skills 调研

英文详细版见 [Skills Research](../skills-research.md)。

## 调研目的

为当前项目找到可以复用的项目管理、PRD、issue 拆分、实施计划和验证类 skills。

## 推荐采用顺序

1. `project-planner`
2. `to-prd`
3. `to-issues`
4. `verification-before-completion`
5. `writing-plans`
6. `extract-design-system`
7. `executing-plans`
8. `triage`
9. `brainstorming`
10. `gsd`，仅在项目需要更重型 phase management 时考虑

## 已经使用

### to-prd

用于把已有研究文档整理成 PRD。

输出：

- [PRD](prd.md)

### to-issues

用于把 PRD 拆成垂直切片 issue。

输出：

- [Issue 拆分草案](issue-breakdown-draft.md)

## 当前最值得使用

### project-planner

用途：

- 为 `Create the First Validated UI AST Run` 写实施计划
- 梳理 affected modules
- 定义 verification criteria
- 标出 risks and unknowns

这是下一步最适合的 skill。

## 暂不全量采用

### GSD

GSD 是完整项目管理系统，功能很强，但当前项目不需要一下子引入这么重的框架。

建议：

- 先借鉴它的 phase planning 和 verification 思路
- 等项目进入持续开发阶段再考虑全量采用

### commit-work

用于把 Git 提交纪律迁移到文档工程里。

核心价值：

- 检查变更边界
- review diff
- 使用 Conventional Commits
- 把无关变更拆开
- 提交前做最小验证

当前项目已经基于它新增：

- [文档工程工作流](document-engineering-workflow.md)

## 项目内落地

已经新增：

- [任务面板](tasks.md)
- [项目管理工作流](project-management.md)

下一步：

- 确认 issue 拆分
- 为第一个实现任务写 implementation plan
