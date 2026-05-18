# 项目管理工作流

英文执行版见 [Project Management Workflow](../project-management.md)。

## 目的

项目已经从零散研究进入小型项目阶段，需要：

- 一个统一任务面板
- PRD 到 issue 的工作流
- 单个切片的实施计划
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

## 选定工作流

```text
研究文档
  -> PRD
  -> 垂直 issue 拆分
  -> 任务面板
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

