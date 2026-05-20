import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const contentDir = join(publicDir, "content");
const vendorDir = join(publicDir, "vendor");

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
  { source: "docs/information-architecture.md", section: "Workflow", lang: "en", order: 47 },
  { source: "docs/concept-map-research.md", section: "Workflow", lang: "en", order: 48 },
  { source: "docs/obsidian-graph-open-source-research.md", section: "Workflow", lang: "en", order: 49 },
  { source: "docs/mind-map-library-evaluation.md", section: "Workflow", lang: "en", order: 50 },
  { source: "docs/module-governance-first.md", section: "Workflow", lang: "en", order: 51 },
  { source: "docs/reuse-first-discovery-gate.md", section: "Workflow", lang: "en", order: 52 },
  { source: "docs/module-passports/documentation-system.md", section: "Module Passports", lang: "en", order: 53 },
  { source: "docs/skills-research.md", section: "Workflow", lang: "en", order: 54 },

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
  { source: "docs/zh-CN/information-architecture.md", section: "中文工作流", lang: "zh-CN", order: 137 },
  { source: "docs/zh-CN/concept-map-research.md", section: "中文工作流", lang: "zh-CN", order: 138 },
  { source: "docs/zh-CN/obsidian-graph-open-source-research.md", section: "中文工作流", lang: "zh-CN", order: 139 },
  { source: "docs/zh-CN/mind-map-library-evaluation.md", section: "中文工作流", lang: "zh-CN", order: 140 },
  { source: "docs/zh-CN/module-governance-first.md", section: "中文工作流", lang: "zh-CN", order: 141 },
  { source: "docs/zh-CN/reuse-first-discovery-gate.md", section: "中文工作流", lang: "zh-CN", order: 142 },
  { source: "docs/zh-CN/module-passports/documentation-system.md", section: "中文模块 Passport", lang: "zh-CN", order: 143 },
  { source: "docs/zh-CN/skills-research.md", section: "中文工作流", lang: "zh-CN", order: 144 }
];

const readingPaths = {
  "START_HERE.md": ["resume", "orient"],
  ".codex/handoffs/current.md": ["resume", "audit"],
  "README.md": ["orient"],
  "TASKS.md": ["resume", "plan"],
  "docs/prd.md": ["orient", "plan"],
  "docs/issue-breakdown-draft.md": ["plan"],
  "docs/project-management.md": ["plan", "operate"],
  "docs/mvp-roadmap.md": ["plan"],
  "docs/next-tasks.md": ["resume", "plan"],
  "docs/workflow-overview.md": ["orient", "research"],
  "docs/existing-tools-and-algorithms.md": ["research"],
  "docs/component-clustering-strategy.md": ["research"],
  "docs/design-token-extraction.md": ["research"],
  "docs/open-questions.md": ["research", "plan"],
  "docs/documentation-system.md": ["operate"],
  "docs/document-engineering-workflow.md": ["operate"],
  "docs/skill-usage-policy.md": ["operate", "audit"],
  "docs/skill-usage-log.md": ["audit"],
  "docs/session-continuity.md": ["resume", "operate"],
  "docs/workflow-retrospective.md": ["operate", "audit"],
  "docs/docs-site.md": ["operate"],
  "docs/information-architecture.md": ["operate", "audit"],
  "docs/concept-map-research.md": ["research", "operate"],
  "docs/obsidian-graph-open-source-research.md": ["research", "plan", "operate"],
  "docs/mind-map-library-evaluation.md": ["research", "plan", "operate"],
  "docs/module-governance-first.md": ["plan", "operate", "research"],
  "docs/reuse-first-discovery-gate.md": ["research", "plan", "operate"],
  "docs/module-passports/documentation-system.md": ["operate", "audit", "plan"],
  "docs/skills-research.md": ["research", "audit"],

  "docs/zh-CN/index.md": ["resume", "orient", "zh"],
  "docs/zh-CN/readme.md": ["orient", "zh"],
  "docs/zh-CN/tasks.md": ["resume", "plan", "zh"],
  "docs/zh-CN/prd.md": ["orient", "plan", "zh"],
  "docs/zh-CN/issue-breakdown-draft.md": ["plan", "zh"],
  "docs/zh-CN/project-management.md": ["plan", "operate", "zh"],
  "docs/zh-CN/mvp-roadmap.md": ["plan", "zh"],
  "docs/zh-CN/next-tasks.md": ["resume", "plan", "zh"],
  "docs/zh-CN/workflow-overview.md": ["orient", "research", "zh"],
  "docs/zh-CN/existing-tools-and-algorithms.md": ["research", "zh"],
  "docs/zh-CN/component-clustering-strategy.md": ["research", "zh"],
  "docs/zh-CN/design-token-extraction.md": ["research", "zh"],
  "docs/zh-CN/open-questions.md": ["research", "plan", "zh"],
  "docs/zh-CN/documentation-system.md": ["operate", "zh"],
  "docs/zh-CN/document-engineering-workflow.md": ["operate", "zh"],
  "docs/zh-CN/skill-usage-policy.md": ["operate", "audit", "zh"],
  "docs/zh-CN/skill-usage-log.md": ["audit", "zh"],
  "docs/zh-CN/session-continuity.md": ["resume", "operate", "zh"],
  "docs/zh-CN/workflow-retrospective.md": ["operate", "audit", "zh"],
  "docs/zh-CN/docs-site.md": ["operate", "zh"],
  "docs/zh-CN/information-architecture.md": ["operate", "audit", "zh"],
  "docs/zh-CN/concept-map-research.md": ["research", "operate", "zh"],
  "docs/zh-CN/obsidian-graph-open-source-research.md": ["research", "plan", "operate", "zh"],
  "docs/zh-CN/mind-map-library-evaluation.md": ["research", "plan", "operate", "zh"],
  "docs/zh-CN/module-governance-first.md": ["plan", "operate", "research", "zh"],
  "docs/zh-CN/reuse-first-discovery-gate.md": ["research", "plan", "operate", "zh"],
  "docs/zh-CN/module-passports/documentation-system.md": ["operate", "audit", "plan", "zh"],
  "docs/zh-CN/skills-research.md": ["research", "audit", "zh"]
};

const readingPathLabels = [
  { id: "all", label: "All", hint: "Everything" },
  { id: "resume", label: "Resume", hint: "Start or continue" },
  { id: "orient", label: "Understand", hint: "Product intent" },
  { id: "plan", label: "Plan", hint: "Next work" },
  { id: "research", label: "Research", hint: "Evidence" },
  { id: "operate", label: "Operate", hint: "Rules" },
  { id: "audit", label: "Audit", hint: "History" },
  { id: "zh", label: "中文", hint: "中文把控" }
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

function normalizeRelativeDoc(baseSource, href) {
  if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return null;
  }
  const clean = href.replace(/^(\.\/)+/, "");
  const withoutHash = clean.split("#")[0];
  if (!withoutHash.endsWith(".md")) return null;
  if (withoutHash.startsWith("/")) return withoutHash.slice(1);
  const baseParts = baseSource.split("/");
  baseParts.pop();
  const parts = [...baseParts, ...withoutHash.split("/")];
  const resolved = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") resolved.pop();
    else resolved.push(part);
  }
  return resolved.join("/");
}

function extractLinks(markdown, source) {
  const links = new Set();
  for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const resolved = normalizeRelativeDoc(source, match[1]);
    if (resolved) links.add(resolved);
  }
  return [...links];
}

function companionFor(source) {
  if (source === "README.md") return "docs/zh-CN/readme.md";
  if (source === "TASKS.md") return "docs/zh-CN/tasks.md";
  if (source.startsWith("docs/") && !source.startsWith("docs/zh-CN/")) {
    return source.replace(/^docs\//, "docs/zh-CN/");
  }
  if (source.startsWith("docs/zh-CN/")) {
    const base = source.replace(/^docs\/zh-CN\//, "docs/");
    if (base === "docs/readme.md") return "README.md";
    if (base === "docs/tasks.md") return "TASKS.md";
    return base;
  }
  return null;
}

await rm(contentDir, { recursive: true, force: true });
await mkdir(contentDir, { recursive: true });
await mkdir(vendorDir, { recursive: true });
await copyFile(
  join(root, "node_modules/cytoscape/dist/cytoscape.esm.min.mjs"),
  join(vendorDir, "cytoscape.esm.min.mjs")
);

const manifest = [];
const markdownBySource = new Map();

for (const doc of docs) {
  const sourcePath = join(root, doc.source);
  const markdown = await readFile(sourcePath, "utf8");
  markdownBySource.set(doc.source, markdown);
  const targetPath = join(contentDir, doc.source);
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, markdown);

  manifest.push({
    ...doc,
    title: titleFromMarkdown(markdown, doc.source),
    summary: summaryFromMarkdown(markdown),
    paths: readingPaths[doc.source] ?? ["reference"],
    contentPath: posix.join("/content", doc.source.split("/").map(encodeURIComponent).join("/"))
  });
}

manifest.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

const docSourceSet = new Set(manifest.map((doc) => doc.source));
const pathNodes = readingPathLabels
  .filter((path) => path.id !== "all")
  .map((path) => ({
    id: `path:${path.id}`,
    label: path.label,
    kind: "path",
    hint: path.hint
  }));

const docNodes = manifest.map((doc) => ({
  id: doc.source,
  label: doc.title,
  kind: "doc",
  lang: doc.lang,
  section: doc.section,
  paths: doc.paths
}));

const edges = [];
const edgeKeys = new Set();

function addEdge(source, target, type, label) {
  if (!source || !target || source === target) return;
  const key = `${source}->${target}:${type}`;
  if (edgeKeys.has(key)) return;
  edgeKeys.add(key);
  edges.push({ source, target, type, label });
}

for (const doc of manifest) {
  for (const path of doc.paths ?? []) {
    if (path === "zh") continue;
    addEdge(`path:${path}`, doc.source, "path", "organizes");
  }

  const companion = companionFor(doc.source);
  if (companion && docSourceSet.has(companion) && doc.source < companion) {
    addEdge(doc.source, companion, "companion", "companion");
  }

  for (const link of extractLinks(markdownBySource.get(doc.source) ?? "", doc.source)) {
    if (docSourceSet.has(link)) {
      addEdge(doc.source, link, "references", "references");
    }
  }
}

const graph = {
  nodes: [...pathNodes, ...docNodes],
  edges
};

await writeFile(join(publicDir, "docs-manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), docs: manifest, graph }, null, 2)}\n`);

console.log(`Prepared ${manifest.length} documentation files and ${graph.edges.length} graph edges.`);
