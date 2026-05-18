# Documentation System

## Purpose

This project uses a bilingual documentation system.

English is optimized for agent execution, skill workflows, issue generation, schemas, and implementation planning.

Chinese is optimized for product understanding, decision review, quality control, and human alignment.

This documentation system is itself a governed module. Its module passport lives at [Documentation System Module Passport](module-passports/documentation-system.md).

## Structure

```text
README.md                     English project entry
TASKS.md                      English task board
docs/*.md                     English source documents
docs/zh-CN/index.md           Chinese documentation entry
docs/zh-CN/*.md               Chinese companion documents
```

## Source of Truth

English documents are the canonical execution source.

Chinese documents are companion documents. They should preserve decisions, scope, priorities, risks, and acceptance criteria, but they do not need to mirror every implementation detail word for word.

When the two disagree:

1. Use the English version for implementation details.
2. Use the Chinese version to check whether the product intent is still correct.
3. Update both if a decision changes.

## Naming

Chinese companion documents should use the same file basename as the English source:

```text
docs/prd.md
docs/zh-CN/prd.md
```

Root-level files can have Chinese companions in `docs/zh-CN/`:

```text
README.md
docs/zh-CN/readme.md

TASKS.md
docs/zh-CN/tasks.md
```

## Update Policy

When adding or changing important project docs:

- update the English source first
- update the Chinese companion in the same change
- if a full translation is not practical, add a Chinese decision summary and mark the missing part clearly
- keep links between language versions visible

## Translation Style

Chinese docs should not be stiff literal translations.

Preferred style:

- preserve technical terms such as `UI AST`, `component candidate`, `design token`, `diff report`
- explain why a decision matters
- keep implementation commands only when they are useful to the user
- use concise Chinese for product tradeoffs and risks

## Current Coverage

The first bilingual pass covers every current project document with a Chinese companion document.

## Module Governance

Current readiness:

```text
M4 - Verified
```

Target readiness:

```text
M5 - Reusable
```

The documentation system should be judged by module standards, not only by whether the files exist.

Minimum module checks:

- important docs are discoverable in the browser site
- important docs have Chinese companions when they affect project direction
- `TASKS.md` reflects the current execution state
- `.codex/handoffs/current.md` can restart a new session
- skill usage is logged when a skill shaped the work
- Concept Map still renders document relationships
- `npm run build` succeeds after documentation changes

The next promotion gate is to make the documentation system reusable in another project, not merely useful inside this one.
