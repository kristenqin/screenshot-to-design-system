# 模块治理优先

这份文档沉淀一个项目原则：

> 当底层模块还不清楚时，不要急着直接做产品 MVP。先把重要模块变得可理解、有边界、可验证、可复用，然后再把它们组合成产品流程。

这不是反对 MVP，而是避免一个薄弱 MVP 演变成失控复杂度、信心流失，以及一个“还不如重来”的项目。

## 可复用的外部思想

| 来源 | 可复用思想 | 本项目如何使用 |
| --- | --- | --- |
| [Domain-Driven Design: Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) | 模型只有在清晰边界内才是自洽的。 | 把每个 pipeline 模块都当成 bounded context，定义自己的语言、输入、输出和不变量。 |
| [Team Topologies](https://teamtopologies.com/key-concepts-content/what-are-the-core-team-types-in-team-topologies) | 架构和团队边界应该降低认知负载并支持快速流动。 | 每个模块都要小到人和 AI agent 可以单独理解，而不必加载整个系统。 |
| [C4 Model](https://c4model.com/introduction) | 用 context、container、component、code 多层抽象描述系统。 | 每个模块按合适层级写文档，不把产品故事、架构和实现细节混在一页里。 |
| [Architecture Decision Records](https://adr.github.io/) | 用轻量记录保存重要决策的背景和后果。 | 选择 API、算法、模型供应商、schema 或关键 tradeoff 时，记录模块级 ADR。 |
| [Diátaxis](https://diataxis.fr/) | 文档应区分 tutorial、how-to、reference、explanation。 | 成熟模块应该逐步拥有：概览、操作指南、接口参考、设计理由。 |
| [Google SRE SLOs](https://sre.google/sre-book/service-level-objectives/) | 服务健康应该用指标、目标和用户相关行为定义。 | 模块质量用可测检查定义，例如 OCR recall、bbox error、cluster purity、token stability、diff improvement。 |
| [NASA Technology Readiness Levels](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/) | 成熟度应该分级评估，而不是凭感觉判断。 | 在模块进入产品流程前，使用轻量 Module Readiness Level。 |
| [Minimum Viable Architecture](https://www.infoq.com/articles/minimum-viable-architecture/) | MVP 仍然需要足够架构来满足质量属性。 | screenshot-to-design MVP 不能绕过模块 contract、验证和可替换性。 |
| [Minimum Viable Capability](https://www.sei.cmu.edu/blog/introducing-the-minimum-viable-capability-strategy/) | 复杂系统更适合先证明 capability，而不只是薄产品壳。 | 优先证明可靠的 UI AST capability 或 clustering capability，而不是宽而脆的端到端 demo。 |
| [Tracer Bullets](https://www.artima.com/articles/tracer-bullets-and-prototypes) | 尽早建立真实路径获取反馈，但不假装整个系统已完成。 | 只有关键模块 contract 足够清楚后，再用 tracer-bullet integration 串联。 |

## 项目原则

本项目应该采用这个顺序：

```text
module boundary
  -> module contract
  -> module verification
  -> module readiness
  -> product integration
  -> product MVP
```

这会反转“先做端到端 demo”的惯性。Demo 仍然有价值，但它应该由行为可检查、可信任的模块组合出来。

## Module Passport

每个重要模块都应该逐步拥有一份简短 passport：

| 字段 | 含义 |
| --- | --- |
| Purpose | 这个模块负责什么问题。 |
| Non-purpose | 这个模块明确不负责什么。 |
| Inputs | 需要的文件、数据、模型输出或人工决策。 |
| Outputs | 这个模块产出的 artifacts。 |
| Contract | Schema、API、数据格式或行为约定。 |
| Dependencies | 外部工具、模型、API、库或人工 review。 |
| Verification | 如何判断模块是否工作正常。 |
| Failure modes | 模块会如何失败，以及失败如何暴露。 |
| Replaceability | 如果替换实现，哪些接口必须保持稳定。 |
| Readiness level | 当前成熟度和下一步晋级门槛。 |
| Decisions | 解释关键选择的 ADR 或研究文档。 |

## Module Readiness Levels

本项目使用一个受 TRL 启发、但适配 AI 协作软件模块的轻量成熟度模型。

| Level | 名称 | 含义 | 晋级证据 |
| --- | --- | --- | --- |
| M0 | Named | 模块只是一个粗略想法。 | 一句话目的和归属文档。 |
| M1 | Researched | 已了解现成工具、风险和候选方案。 | 有研究文档，记录采用和拒绝选项。 |
| M2 | Contracted | 输入、输出和边界明确。 | 有 schema、API 草图或 artifact contract。 |
| M3 | Prototyped | 狭窄原型能在一个受控样本上跑通。 | 可复现运行和保存输出。 |
| M4 | Verified | 模块在代表性样本上有检查。 | 有指标、视觉检查流程或 regression fixture。 |
| M5 | Reusable | 模块能脱离当前 pipeline 被复用。 | 稳定接口、文档、示例和替换说明。 |
| M6 | Integrated | 模块进入产品流程，并且不会隐藏失败。 | 端到端 trace、日志化输出和失败诊断。 |

产品 MVP 不应该依赖仍处于 M0/M1 的模块，除非集成时明确把它们标为高风险实验。

## 当前模块地图

| 模块 | 当前级别 | 原因 | 下一道门槛 |
| --- | --- | --- | --- |
| Screenshot intake | M1 | 已知需要高质量截图，但输入标准还没有正式化。 | 定义截图质量 checklist 和 fixture 文件夹。 |
| Wireframe generation | M3 | 豆包作为黑盒能力已经被人工验证效果较强。 | 记录 API contract、成本假设和样例输出。 |
| UI AST parsing | M1 | 已被识别为第一个核心实现目标。 | 定义 UI AST schema，并完成 first validated run。 |
| Component clustering | M1 | 已有策略，但还没有 fixture-backed prototype。 | 定义 candidate contract 和 similarity metrics。 |
| Design token extraction | M1 | 已有研究，但颜色/字体/间距提取需要样本验证。 | 定义 token schema 和验证样本。 |
| Reconstruction output | M0 | 输出目标仍在 Figma、HTML、React 之间摇摆。 | 为窄切片选择第一个输出目标。 |
| Diff verification | M1 | 已识别反馈信号。 | 定义第一个 visual/OCR/bbox diff report contract。 |
| Documentation system | M4 | 浏览器文档站、双语文档、handoff、skill audit、concept map 和 [module passport](module-passports/documentation-system.md) 已工作。 | 创建可复用 passport template 和自动化一致性检查。 |

## 对路线图的影响

路线图不应该只问：

> 最小端到端产品 demo 是什么？

而应该先问：

> 哪个模块需要先变得足够可信，才能让下一个模块依赖它？

因此，下一步技术里程碑应该是：

> 把 UI AST parsing 从 M1 推进到 M3。

这意味着定义 schema，用一个受控截图跑通解析，保存输出，并验证后续模块能消费这个结果。

当多个模块达到 M3/M4 后，再组合产品 MVP，技术债和心理负担都会小很多。
