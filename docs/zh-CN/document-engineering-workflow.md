# 文档工程工作流

英文执行版见 [Document Engineering Workflow](../document-engineering-workflow.md)。

## 目的

这个项目的文档已经不是普通笔记，而是类似软件工程里的规格系统。

这些文档会：

- 定义产品行为
- 定义实现边界
- 驱动 AI 执行
- 形成任务和计划
- 需要可追溯的变更历史
- 需要中英文同步

所以我们应该用类似 Git 管理代码的方式管理文档。

## 借鉴的 Skills.sh 工作流

### commit-work

核心思想：

- 提交前先检查 working tree
- 按逻辑边界拆分变更
- 只 stage 有意图的改动
- review staged diff
- 写清楚 what / why
- 使用 Conventional Commits
- 做最小有效验证

转译到当前项目：

- 文档变更完成前要 review diff
- 无关文档变更不要混在一起
- 重大 PRD、roadmap、task-board 变更要说明原因
- 中英文 companion 要一起检查

## 当前仓库状态

目前 `screenshot-to-design-system` 还不是一个独立 Git 仓库。

需要决策：

- 是否把这个目录初始化成独立 Git repo？
- 还是继续作为大 workspace 里的普通目录？

建议：

- 当你希望保留文档演进历史时，把它初始化成独立 Git repo。

## 文档变更生命周期

### 1. 定义变更意图

每次改文档前先明确：

- 改什么？
- 为什么改？
- 影响哪些文档？
- 是改变产品范围、执行计划，还是只调整表达？

### 2. 确定变更边界

好的边界：

- PRD 更新
- issue 拆分更新
- task-board 更新
- 中英文同步
- 调研补充
- 流程规范更新

避免把无关内容混在一个变更里。

### 3. 先改英文源文档

英文文档是 agent 执行源。

涉及 PRD、issue、schema、task、workflow 的变更，先改英文。

### 4. 同步中文 companion

中文文档是产品把控层。

同步时重点保留：

- 决策
- 取舍
- 风险
- 范围
- 验收标准

不用逐字翻译所有实现噪音。

### 5. Review diff

如果项目初始化 Git，完成前运行：

```bash
git diff --stat
git diff
```

检查：

- 是否有无关改动
- 链接是否失效
- 中英文是否矛盾
- 任务状态是否漂移
- 作用域变化是否同步到 PRD 或 issue 拆分

### 6. 轻量验证

最小检查：

- 新增文档有入口链接
- 中文 index 包含新中文文档
- README 包含重要入口
- 任务状态准确

### 7. 逻辑提交

初始化 Git 后，提交建议使用：

```text
docs(scope): short summary

说明改了什么，以及为什么改。
```

示例：

```text
docs(prd): define UI AST as central execution contract
docs(tasks): add task board for vertical issue slices
docs(bilingual): add Chinese companion docs
docs(workflow): define document engineering process
```

## Review Checklist

文档变更完成前检查：

- [ ] 变更意图清楚。
- [ ] 英文源文档已更新。
- [ ] 需要时中文 companion 已同步。
- [ ] 新增重要文档已加入 README 或中文 index。
- [ ] 任务状态已更新。
- [ ] 没有无关格式化改动。
- [ ] 未决问题已明确标记。
- [ ] 已记录验证方式。

## 下一步

需要确认是否把当前项目初始化为独立 Git 仓库。

如果确认，第一条提交可以是：

```text
docs(project): initialize screenshot-to-design-system documentation
```

