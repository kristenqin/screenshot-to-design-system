# 文档系统

英文执行版见 [Documentation System](../documentation-system.md)。

## 目的

这个项目采用中英双语文档系统。

英文用于：

- agent 执行
- skills 工作流
- issue 拆分
- schema 和实现计划

中文用于：

- 产品理解
- 方向判断
- 质量把控
- 决策 review

## 结构

```text
README.md                     英文项目入口
TASKS.md                      英文任务面板
docs/*.md                     英文源文档
docs/zh-CN/index.md           中文文档入口
docs/zh-CN/*.md               中文 companion 文档
```

## 事实来源

英文文档是 canonical execution source。

中文文档是 companion document。它需要保留关键决策、范围、优先级、风险和验收标准，但不需要逐字翻译所有实现细节。

如果中英文不一致：

1. 实现细节以英文为准。
2. 产品意图以中文为检查依据。
3. 决策变更时同步更新两边。

## 命名规则

中文 companion 使用相同文件名：

```text
docs/prd.md
docs/zh-CN/prd.md
```

根目录文件放在 `docs/zh-CN/` 下：

```text
README.md
docs/zh-CN/readme.md

TASKS.md
docs/zh-CN/tasks.md
```

## 更新规则

新增或修改重要文档时：

- 先更新英文源文档
- 同步更新中文 companion
- 如果暂时无法完整翻译，至少补充中文决策摘要并标明缺口
- 保持语言版本之间的链接可见

