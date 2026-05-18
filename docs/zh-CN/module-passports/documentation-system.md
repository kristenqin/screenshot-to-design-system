# 文档系统 Module Passport

## 成熟度

当前级别：**M4 - Verified**

目标级别：**M5 - Reusable**

文档系统已经不只是项目笔记。它是一个真实的运行模块，用来帮助人和 AI agent 理解项目、恢复上下文、审计过程并治理项目。

## Purpose

负责项目的知识层：

- 保存产品意图
- 保存执行上下文
- 暴露任务状态
- 记录 skill 使用
- 支持中英双语人机协作
- 提供浏览器阅读导航
- 用 Concept Map 暴露文档关系

## Non-purpose

这个模块不负责：

- 生产级 screenshot-to-design 算法
- 模型供应商实现
- UI AST parsing 实现
- component clustering 实现
- design token extraction 实现
- 最终 reconstruction output

它可以记录这些模块，但不能用精致文档掩盖技术实现缺失。

## Inputs

- 英文源文档
- 中文 companion 文档
- 用户决策和产品反馈
- skill 使用记录
- session handoff 上下文
- task board 更新
- 文档之间的 Markdown 链接
- `scripts/build-docs-content.mjs` 中的 reading-path 元数据

## Outputs

- Markdown 文档
- 中英 companion docs
- task board
- session handoff
- skill usage audit log
- 本地浏览器文档站
- 生成的 docs manifest
- 生成的文档 Concept Map

## Contract

canonical 内容保存在 Markdown：

```text
README.md
TASKS.md
START_HERE.md
docs/*.md
docs/zh-CN/*.md
.codex/handoffs/current.md
```

生成的阅读产物不是事实来源：

```text
public/content/
public/docs-manifest.json
```

每次重要文档变更应满足：

- 有英文源文档，方便 agent 执行。
- 影响项目方向时，有中文 companion 方便人 review。
- 如果文档需要进入浏览器站点，应注册到 `scripts/build-docs-content.mjs`。
- 如果 required skill 影响了工作，应记录 skill usage。
- 如果影响后续执行，应同步更新 task board 或 handoff。

## Dependencies

- Node.js runtime，用于本地文档站
- `npm run build`，用于生成 manifest
- `npm run dev`，用于浏览器阅读
- Browser verification，用于可见站点变更
- Git commits，用于变更审计
- 按任务类型使用的 Codex skills

## Verification

最低验证：

- `npm run build` 成功。
- docs manifest 包含预期文档数量。
- 新的重要文档出现在浏览器导航中。
- Concept Map 仍能渲染节点和边。
- 内部 Markdown 链接尽量能在文档站内跳转。
- `git diff --check` 没有 whitespace 错误。

更强验证：

- 检查中英 companion 覆盖率
- 检查每个注册文档都真实存在
- 检查每个文档都有 reading-path metadata
- 检查 manifest 生成后 graph edges 非零

## Failure Modes

| Failure | Signal | Response |
| --- | --- | --- |
| 文档存在但不可发现 | 浏览器导航或 Concept Map 缺失 | 注册到 `scripts/build-docs-content.mjs`。 |
| 中英文漂移 | 决策或优先级不一致 | 同步更新两边，英文保留执行细节，中文保留产品意图。 |
| 文档看似完整但任务状态过期 | `TASKS.md` 或 handoff 与当前方向矛盾 | 同一次变更中更新 task board 和 handoff。 |
| skill 使用不可追踪 | skill usage log 缺失 | 补充来源、原因、输出、偏离、验证。 |
| Concept Map 噪声过高 | 边太多或标签不清楚 | 先加关系元数据和过滤，再考虑引入大型图库。 |
| 浏览器站点和源文档不一致 | 生成内容过期 | 运行 `npm run build` 或重启 `npm run dev`。 |

## Replaceability

文档站实现可以替换成 VitePress、Docusaurus、Astro、Obsidian Publish、Quartz 或其他工具，只要保持这些契约：

- Markdown 仍是 canonical。
- 双语结构保持明确。
- 任务状态保持可见。
- session handoff 保持可预测。
- skill 使用保持可审计。
- Concept Map 或关系图仍然可用。
- 新 Codex session 的本地启动足够简单。

## Decisions

- [文档系统](../../documentation-system.md)
- [文档站](../../docs-site.md)
- [信息架构](../../information-architecture.md)
- [概念图调研](../../concept-map-research.md)
- [模块治理优先](../../module-governance-first.md)
- [Skill 使用规范](../../skill-usage-policy.md)
- [Session 连续性](../../session-continuity.md)

## 下一道晋级门槛

要达到 **M5 - Reusable**，这个模块需要：

- 可复用的文档系统初始化 checklist
- module passport template
- 自动化 companion coverage 检查
- 自动化 manifest consistency 检查
- 一份将这个文档系统迁移到其他项目的简短指南

第一个具体升级应该是：

> 创建可复用 module passport template，并在下一个技术模块中使用它。
