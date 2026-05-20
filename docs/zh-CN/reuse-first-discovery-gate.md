# 复用优先发现门禁

## 目的

当成熟工具、skill、库、托管 API 或产品模式可以解决问题时，本项目不应该默认自研。

这个门禁存在的原因是，实施成本不只是工程时间，还包括：

- 人类等待时间
- token 成本
- review 疲劳
- 上下文漂移
- debugging 成本
- 后续维护负担
- 半成品模块带来的心理损耗

默认姿态应该是：

> 先调研可复用方案。只有在复用路径被理解并明确拒绝或限定范围之后，才进入实现。

## Skills.sh 输入

下面这些 Skills.sh 资源应该影响这个门禁：

| Skill | 在本项目中的用途 |
| --- | --- |
| [evaluating-new-technology](https://skills.sh/refoundai/lenny-skills/evaluating-new-technology) | 在采用、替换或自研重要技术前使用。核心思想是 build AND buy：标准能力优先购买或复用，只自研能形成项目差异化的部分。 |
| [spec-first](https://skills.sh/shipshitdev/library/spec-first) | 当实现方向还不稳定时使用。先定义行为、权衡和验收，再写代码。 |
| [simple-brainstorm](https://skills.sh/roin-orca/skills/simple-brainstorm) | 当用户还在探索选项时使用。方向未获确认前，不写代码、不 scaffold、不执行实现。 |
| [implementation-planner](https://skills.sh/jumppad-labs/jumppad/implementation-planner) | 在复用决策完成后，把选定方案转成具体计划。 |
| [create-plan](https://skills.sh/openai/skills/create-plan) | 用于 discovery 之后的结构化计划，而不是替代 discovery。 |

## 触发条件

满足任意条件时，实施前必须先走这个门禁：

- 任务涉及第三方 UI、图谱、工作流、文档、测试、解析、图像或 ML 能力。
- 预期改动超过 2-3 个文件。
- 任务需要技术选型或产品交互设计。
- 该能力不是项目核心差异化能力。
- 用户询问是否存在工具、skill、库或成熟方案。
- 前一次尝试出现高摩擦、低质量或价值不清晰。
- 工作可能制造长期维护负担。

## 必须遵循的顺序

写代码前：

1. 搜索可复用工具、库、skill、API 或产品模式。
2. 尽量找出至少 2 个可行选项。
3. 比较 tradeoffs：
   - 是否匹配用户目标
   - 实施成本
   - 维护成本
   - 集成风险
   - 质量上限
   - lock-in 风险
   - 可逆性
4. 推荐其中一种路径：
   - 直接复用
   - 轻量集成
   - 用第三方工具 prototype
   - 自研
   - 暂停，因为问题还不够清楚
5. 如果选择会改变产品方向、增加依赖或消耗明显时间，需要先确认。
6. 方向明确后才开始实现。

## 决策记录模板

在计划或文档中使用这个简短模板：

```text
Discovery gate:
- Problem:
- Existing options checked:
- Recommended path:
- Why not self-build:
- Why self-build is justified, if applicable:
- Verification:
- Reversibility:
```

## 在当前项目中的应用

示例：

| 领域 | 默认姿态 |
| --- | --- |
| 线稿生成 | 继续复用豆包，除非找到更便宜且质量相当的方案。 |
| Concept Map 渲染 | 先复用图库或现成知识图谱工具，再考虑调自定义渲染。 |
| 文档站 | 如果自研站点维护成本变高，优先评估成熟 docs framework。 |
| OCR | 先复用成熟 OCR engine，再考虑模型工作。 |
| UI detection | 先复用 UIED、YOLO 系检测器或现成 screen parsing 工具。 |
| Component clustering | 先复用 embedding、clustering、visual similarity 库。 |
| Design token extraction | 在质量可接受时复用颜色、字体、布局提取库。 |

## 完成规则

implementation task 只有在 discovery gate 完成后才可以开始：

- 要么选择了可复用路径；
- 要么记录了为什么自研值得承担成本。

如果用户明确是在 brainstorm 或讨论，当前 turn 不进行实现，除非用户后续确认执行。
