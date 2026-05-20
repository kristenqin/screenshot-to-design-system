# 项目管理工作流

英文执行版见 [Project Management Workflow](../project-management.md)。

## 目的

项目已经从零散研究进入小型项目阶段，需要：

- 一个统一任务面板
- PRD 到 issue 的工作流
- 单个切片的实施计划
- 非核心实现前的复用优先发现门禁
- 完成前验证机制

## Skills.sh 调研结论

### project-planner

最适合当前阶段。

用途：

- 给较大的垂直切片写实施计划
- 标出 affected modules
- 定义 verification criteria
- 记录 risks and unknowns

### task-decomposition

适合作为 `project-planner` 之后的进一步拆解工具，但目前先不引入。

### GSD

是更重型的项目管理系统。当前项目暂时不需要全量采用，但可以借鉴 phase planning 和 verification 的思想。

### to-prd

已经使用，产出了 [PRD](prd.md)。

### to-issues

已经使用，产出了 [Issue 拆分草案](issue-breakdown-draft.md)。

### verification-before-completion

非常适合这个项目，因为视觉和结构质量都需要证据支撑。即使还没安装，也应当把它作为流程规则。

### evaluating-new-technology

适合用于技术选型前的结构化评估。

在本项目中，它应当作为 [复用优先发现门禁](reuse-first-discovery-gate.md) 的一部分：当任务涉及图谱、OCR、图像、解析、工作流自动化、第三方库或非核心能力时，先评估可复用方案，再决定是否自研。

### spec-first

适合在动手实现前先定义行为、约束和验收标准。

它可以避免 agent 在目标还没收束时直接开始写代码，也能让“为什么不用现成方案”变成一个需要被写清楚的决策。

### simple-brainstorm

适合用于讨论型任务。

当用户是在讨论方向、工具选择、架构或工作习惯时，默认先进入探索和收束，不把讨论直接理解为“马上实现”。

## 选定工作流

```text
研究文档
  -> PRD
  -> 垂直 issue 拆分
  -> 任务面板
  -> 复用优先发现门禁
  -> 单个任务实施计划
  -> 执行
  -> 验证证据
  -> 更新任务面板
```

## 当前任务策略

任务分三层：

1. 产品范围：PRD 和 roadmap
2. 垂直切片：issue breakdown
3. 执行任务：task board 和 implementation plans

避免只创建“写 schema”“做 UI”这种横向任务。每个实现切片都应该能产生可检查 artifact。

在开始实现前，如果任务涉及非核心能力、第三方 UI/图谱能力、图像/OCR/ML/解析基础设施、预计会改动两三个以上文件，或者存在 build-vs-buy 不确定性，应先运行复用优先发现门禁。

## 立即下一步

确认 issue breakdown，然后为下面这个任务写实施计划：

> Create the First Validated UI AST Run

实施计划应该包含：

- objective
- affected modules
- artifact outputs
- verification criteria
- risks and unknowns
- acceptance criteria
