import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const contentDir = join(publicDir, "content");

const docs = [
  { source: "START_HERE.md", section: "Start", lang: "en", order: 1 },
  { source: ".codex/handoffs/current.md", section: "Start", lang: "en", order: 2 },
  { source: "README.md", section: "Project", lang: "en", order: 10 },
  { source: "TASKS.md", section: "Project", lang: "en", order: 11 },
  { source: "docs/prd.md", section: "Planning", lang: "en", order: 20 },
  { source: "docs/issue-breakdown-draft.md", section: "Planning", lang: "en", order: 21 },
  { source: "docs/project-management.md", section: "Planning", lang: "en", order: 22 },
  { source: "docs/mvp-roadmap.md", section: "Planning", lang: "en", order: 23 },
  { source: "docs/next-tasks.md", section: "Planning", lang: "en", order: 24 },
  { source: "docs/workflow-overview.md", section: "Research", lang: "en", order: 30 },
  { source: "docs/existing-tools-and-algorithms.md", section: "Research", lang: "en", order: 31 },
  { source: "docs/component-clustering-strategy.md", section: "Research", lang: "en", order: 32 },
  { source: "docs/design-token-extraction.md", section: "Research", lang: "en", order: 33 },
  { source: "docs/open-questions.md", section: "Research", lang: "en", order: 34 },
  { source: "docs/documentation-system.md", section: "Workflow", lang: "en", order: 40 },
  { source: "docs/document-engineering-workflow.md", section: "Workflow", lang: "en", order: 41 },
  { source: "docs/skill-usage-policy.md", section: "Workflow", lang: "en", order: 42 },
  { source: "docs/skill-usage-log.md", section: "Workflow", lang: "en", order: 43 },
  { source: "docs/session-continuity.md", section: "Workflow", lang: "en", order: 44 },
  { source: "docs/workflow-retrospective.md", section: "Workflow", lang: "en", order: 45 },
  { source: "docs/docs-site.md", section: "Workflow", lang: "en", order: 46 },
  { source: "docs/skills-research.md", section: "Workflow", lang: "en", order: 47 },

  { source: "docs/zh-CN/index.md", section: "中文入口", lang: "zh-CN", order: 100 },
  { source: "docs/zh-CN/readme.md", section: "中文项目", lang: "zh-CN", order: 101 },
  { source: "docs/zh-CN/tasks.md", section: "中文项目", lang: "zh-CN", order: 102 },
  { source: "docs/zh-CN/prd.md", section: "中文规划", lang: "zh-CN", order: 110 },
  { source: "docs/zh-CN/issue-breakdown-draft.md", section: "中文规划", lang: "zh-CN", order: 111 },
  { source: "docs/zh-CN/project-management.md", section: "中文规划", lang: "zh-CN", order: 112 },
  { source: "docs/zh-CN/mvp-roadmap.md", section: "中文规划", lang: "zh-CN", order: 113 },
  { source: "docs/zh-CN/next-tasks.md", section: "中文规划", lang: "zh-CN", order: 114 },
  { source: "docs/zh-CN/workflow-overview.md", section: "中文研究", lang: "zh-CN", order: 120 },
  { source: "docs/zh-CN/existing-tools-and-algorithms.md", section: "中文研究", lang: "zh-CN", order: 121 },
  { source: "docs/zh-CN/component-clustering-strategy.md", section: "中文研究", lang: "zh-CN", order: 122 },
  { source: "docs/zh-CN/design-token-extraction.md", section: "中文研究", lang: "zh-CN", order: 123 },
  { source: "docs/zh-CN/open-questions.md", section: "中文研究", lang: "zh-CN", order: 124 },
  { source: "docs/zh-CN/documentation-system.md", section: "中文工作流", lang: "zh-CN", order: 130 },
  { source: "docs/zh-CN/document-engineering-workflow.md", section: "中文工作流", lang: "zh-CN", order: 131 },
  { source: "docs/zh-CN/skill-usage-policy.md", section: "中文工作流", lang: "zh-CN", order: 132 },
  { source: "docs/zh-CN/skill-usage-log.md", section: "中文工作流", lang: "zh-CN", order: 133 },
  { source: "docs/zh-CN/session-continuity.md", section: "中文工作流", lang: "zh-CN", order: 134 },
  { source: "docs/zh-CN/workflow-retrospective.md", section: "中文工作流", lang: "zh-CN", order: 135 },
  { source: "docs/zh-CN/docs-site.md", section: "中文工作流", lang: "zh-CN", order: 136 },
  { source: "docs/zh-CN/skills-research.md", section: "中文工作流", lang: "zh-CN", order: 137 }
];

function titleFromMarkdown(markdown, fallback) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();
  return fallback.replace(/(^|\/)(index|readme)\.md$/i, "$1overview.md").replace(/\.md$/, "");
}

function summaryFromMarkdown(markdown) {
  const cleaned = markdown
    .replace(/^#.*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, (match) => match.replace(/\[|\]\([^)]+\)/g, ""))
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .find((line) => !line.startsWith("-") && !line.startsWith("|"));
  return cleaned?.slice(0, 180) ?? "";
}

await rm(contentDir, { recursive: true, force: true });
await mkdir(contentDir, { recursive: true });

const manifest = [];

for (const doc of docs) {
  const sourcePath = join(root, doc.source);
  const markdown = await readFile(sourcePath, "utf8");
  const targetPath = join(contentDir, doc.source);
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, markdown);

  manifest.push({
    ...doc,
    title: titleFromMarkdown(markdown, doc.source),
    summary: summaryFromMarkdown(markdown),
    contentPath: posix.join("/content", doc.source.split("/").map(encodeURIComponent).join("/"))
  });
}

manifest.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

await writeFile(join(publicDir, "docs-manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), docs: manifest }, null, 2)}\n`);

console.log(`Prepared ${manifest.length} documentation files.`);
