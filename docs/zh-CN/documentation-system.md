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

文档系统本身也是一个需要治理的模块。它的 module passport 位于 [文档系统 Module Passport](module-passports/documentation-system.md)。

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

## 模块治理

当前成熟度：

```text
M4 - Verified
```

目标成熟度：

```text
M5 - Reusable
```

文档系统也要按模块标准判断，而不是只看文件是否存在。

最低模块检查：

- 重要文档在浏览器站点中可发现
- 影响项目方向的重要文档有中文 companion
- `TASKS.md` 反映当前执行状态
- `.codex/handoffs/current.md` 可以让新 session 恢复上下文
- skill 影响工作时有日志记录
- Concept Map 仍能渲染文档关系
- 文档变更后 `npm run build` 成功

下一道晋级门槛是让文档系统可以被复用到其他项目，而不只是服务当前项目。
