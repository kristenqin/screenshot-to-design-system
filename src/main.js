const app = document.querySelector("#app");

const state = {
  manifest: [],
  graph: { nodes: [], edges: [] },
  cytoscape: null,
  mindElixir: null,
  graphInstance: null,
  graphCanvas: null,
  structureTreeInstance: null,
  active: null,
  search: "",
  lang: "all",
  path: "all",
  view: "doc",
  mapMode: "tree",
  headings: [],
  graphSettings: {
    mode: "global",
    depth: 1,
    showLabels: false,
    showArrows: false,
    showPathEdges: false,
    showCompanions: false,
    nodeScale: 1,
    linkScale: 1,
    repel: 1.25,
    distance: 1.2
  },
  graphSettingsOpen: false
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

function docId(source) {
  return source.replace(/^\.\//, "");
}

function getHashDoc() {
  const params = new URLSearchParams(location.hash.replace(/^#\/?/, ""));
  return params.get("doc");
}

function setHashDoc(source) {
  const params = new URLSearchParams();
  params.set("doc", source);
  history.replaceState(null, "", `#${params.toString()}`);
}

function normalizeRelativeDoc(baseSource, href) {
  if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return null;
  }
  const clean = href.replace(/^(\.\/)+/, "");
  if (clean.startsWith("/")) return clean.slice(1);
  const baseParts = baseSource.split("/");
  baseParts.pop();
  const parts = [...baseParts, ...clean.split("/")];
  const resolved = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") resolved.pop();
    else resolved.push(part);
  }
  return resolved.join("/");
}

function groupDocs(docs) {
  return docs.reduce((groups, doc) => {
    groups[doc.section] ??= [];
    groups[doc.section].push(doc);
    return groups;
  }, {});
}

function filteredDocs() {
  const query = state.search.trim().toLowerCase();
  return state.manifest.filter((doc) => {
    const matchesLang = state.lang === "all" || doc.lang === state.lang;
    const matchesPath = state.path === "all" || doc.paths?.includes(state.path);
    const haystack = `${doc.title} ${doc.summary} ${doc.source} ${doc.section} ${(doc.paths ?? []).join(" ")}`.toLowerCase();
    return matchesLang && matchesPath && (!query || haystack.includes(query));
  });
}

function renderShell() {
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">
          <div>
            <p class="eyebrow">Docs System</p>
            <h1>Screenshot to Design System</h1>
          </div>
        </div>
        <div class="controls">
          <label class="search-label" for="doc-search">Search docs</label>
          <input id="doc-search" class="search" type="search" placeholder="Search title, path, summary" value="${escapeHtml(state.search)}" />
          <div class="path-group" aria-label="Reading paths">
            <p class="filter-title">Reading path</p>
            <div class="path-grid">
              ${readingPathLabels.map(pathButton).join("")}
            </div>
          </div>
          <div class="segments" aria-label="Language filter">
            ${segmentButton("all", "All")}
            ${segmentButton("en", "EN")}
            ${segmentButton("zh-CN", "中文")}
          </div>
        </div>
        <nav class="nav" aria-label="Documentation"></nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <button class="icon-button" id="sidebar-toggle" title="Toggle navigation" aria-label="Toggle navigation">☰</button>
          <div class="topbar-copy">
            <span id="doc-path"></span>
            <strong id="doc-title"></strong>
          </div>
          <button class="view-button" id="map-toggle" type="button">Concept map</button>
          <a class="source-link" id="source-link" target="_blank" rel="noreferrer">Source</a>
        </header>
        <article class="content" id="content"></article>
      </main>
      <aside class="toc" id="toc" aria-label="Table of contents"></aside>
    </div>
  `;

  document.querySelector("#doc-search").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderNav();
    if (state.view === "map") renderConceptMap().catch(showGraphError);
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      renderNav();
      if (state.view === "map") renderConceptMap().catch(showGraphError);
    });
  });

  document.querySelectorAll("[data-path]").forEach((button) => {
    button.addEventListener("click", () => {
      state.path = button.dataset.path;
      if (state.path === "zh") state.lang = "zh-CN";
      renderNav();
      if (state.view === "map") renderConceptMap().catch(showGraphError);
    });
  });

  document.querySelector("#sidebar-toggle").addEventListener("click", () => {
    document.body.classList.toggle("nav-collapsed");
  });

  document.querySelector("#map-toggle").addEventListener("click", () => {
    if (state.view === "map") {
      loadDoc(state.active?.source ?? "START_HERE.md");
    } else {
      renderConceptMap().catch(showGraphError);
    }
  });
}

function segmentButton(value, label) {
  const active = state.lang === value ? "active" : "";
  return `<button class="segment ${active}" type="button" data-lang="${value}">${label}</button>`;
}

function pathButton(item) {
  const active = state.path === item.id ? "active" : "";
  return `
    <button class="path-card ${active}" type="button" data-path="${item.id}">
      <span>${escapeHtml(item.label)}</span>
      <small>${escapeHtml(item.hint)}</small>
    </button>
  `;
}

function renderNav() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  document.querySelectorAll("[data-path]").forEach((button) => {
    button.classList.toggle("active", button.dataset.path === state.path);
  });

  const nav = document.querySelector(".nav");
  const docs = filteredDocs();
  const groups = groupDocs(docs);

  const countLabel = `${docs.length} document${docs.length === 1 ? "" : "s"}`;

  nav.innerHTML = `
    <div class="nav-summary">
      <strong>${escapeHtml(activePathLabel())}</strong>
      <span>${countLabel}</span>
    </div>
    ${Object.entries(groups)
    .map(([section, sectionDocs]) => `
      <section class="nav-section">
        <h2>${escapeHtml(displaySectionLabel(section))}</h2>
        ${sectionDocs.map((doc) => `
          <button class="nav-item ${state.active?.source === doc.source ? "active" : ""}" type="button" data-source="${escapeHtml(doc.source)}">
            <span>${escapeHtml(doc.title)}</span>
            <small>${escapeHtml(doc.source)}</small>
            <em>${escapeHtml(pathNames(doc.paths).join(" / "))}</em>
          </button>
        `).join("")}
      </section>
    `)
    .join("")}
  `;

  nav.querySelectorAll("[data-source]").forEach((button) => {
    button.addEventListener("click", () => loadDoc(button.dataset.source));
  });
}

async function loadDoc(source) {
  const doc = state.manifest.find((item) => item.source === source) ?? state.manifest[0];
  if (!doc) return;
  destroyStructureTree();
  if (state.graphCanvas?.destroy) {
    state.graphCanvas.destroy();
    state.graphCanvas = null;
  }
  if (state.graphInstance) {
    state.graphInstance.destroy();
    state.graphInstance = null;
  }
  state.active = doc;
  state.view = "doc";
  setHashDoc(doc.source);
  renderNav();

  const markdown = await fetch(doc.contentPath).then((response) => {
    if (!response.ok) throw new Error(`Unable to load ${doc.contentPath}`);
    return response.text();
  });

  const content = document.querySelector("#content");
  content.className = "content";
  content.innerHTML = renderMarkdown(markdown, doc);
  decorateHeadings(content);
  bindDocLinks(content);
  renderMeta(doc);
  renderToc();
  content.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function decorateHeadings(content) {
  state.headings = [...content.querySelectorAll("h2, h3")].map((heading, index) => {
    const id = heading.textContent.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || `section-${index + 1}`;
    heading.id = id;
    return { id, text: heading.textContent.trim(), level: heading.tagName.toLowerCase() };
  });
}

function bindDocLinks(content) {
  content.querySelectorAll("[data-doc-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      loadDoc(link.dataset.docLink);
    });
  });
}

function renderMeta(doc) {
  state.view = "doc";
  document.querySelector("#doc-title").textContent = doc.title;
  document.querySelector("#doc-path").textContent = doc.source;
  document.querySelector("#map-toggle").textContent = "Concept map";
  const sourceLink = document.querySelector("#source-link");
  sourceLink.href = doc.source;
  sourceLink.textContent = "Open source";
  sourceLink.hidden = false;
}

function activePathLabel() {
  return readingPathLabels.find((item) => item.id === state.path)?.label ?? "All";
}

function pathNames(paths = []) {
  return paths
    .map((path) => readingPathLabels.find((item) => item.id === path)?.label)
    .filter(Boolean);
}

function renderToc() {
  const toc = document.querySelector("#toc");
  if (!state.headings.length) {
    toc.innerHTML = `<p class="toc-empty">No sections</p>`;
    return;
  }
  toc.innerHTML = `
    <p class="toc-title">On this page</p>
    ${state.headings.map((heading) => `
      <a class="toc-link ${heading.level}" href="#${heading.id}">${escapeHtml(heading.text)}</a>
    `).join("")}
  `;
}

async function renderConceptMap() {
  state.view = "map";
  renderNav();

  const content = document.querySelector("#content");
  const graph = visibleGraph();
  const tree = buildStructureTree();
  const isTree = state.mapMode === "tree";

  document.querySelector("#doc-title").textContent = "Concept Map";
  document.querySelector("#doc-path").textContent = `${activePathLabel()} ${isTree ? "structure tree" : "relationship graph"}`;
  document.querySelector("#map-toggle").textContent = "Reading view";
  document.querySelector("#source-link").hidden = true;

  content.className = "content graph-content";
  content.innerHTML = `
    <section class="graph-intro">
      <div>
        <p class="eyebrow">Concept Map</p>
        <h1>${isTree ? "Project Structure Tree" : "Document Relationship Graph"}</h1>
      </div>
      <p>${isTree
    ? `${tree.docCount} visible docs organized by project lifecycle, module, and document. Select a document leaf to open it.`
    : `${graph.docCount} visible docs, ${graph.edges.length} visible relationships. Pan, zoom, hover to focus, select a node, or double-click to open it.`}</p>
    </section>
    <div class="graph-view-tabs" aria-label="Concept map mode">
      ${mapModeButton("tree", "Structure Tree", "Management view")}
      ${mapModeButton("graph", "Relationship Graph", "Audit view")}
    </div>
    <div class="graph-controls" aria-label="Graph controls">
      <div class="graph-control-group">
        <p class="filter-title">Scope</p>
        <div class="graph-button-grid">
          ${graphScopeButton("zh-CN", "中文决策图", "Decision")}
          ${graphScopeButton("en", "English execution", "Agent")}
          ${graphScopeButton("all", "All audit", "Coverage")}
        </div>
      </div>
      ${isTree ? "" : `
      <div class="graph-control-group">
        <p class="filter-title">View</p>
        <div class="graph-button-grid compact">
          ${graphModeButton("global", "Global", "All visible")}
          ${graphModeButton("local", "Local", `Depth ${state.graphSettings.depth}`)}
        </div>
      </div>
      <div class="graph-control-group">
        <p class="filter-title">Local depth</p>
        <div class="graph-depth-group" aria-label="Local graph depth">
          ${[1, 2, 3].map(depthButton).join("")}
        </div>
      </div>
      `}
    </div>
    ${isTree ? "" : `
    <details class="graph-settings" ${state.graphSettingsOpen ? "open" : ""}>
      <summary>Graph settings</summary>
      <div class="graph-settings-grid">
        ${graphToggle("showLabels", "Labels")}
        ${graphToggle("showArrows", "Arrows")}
        ${graphToggle("showCompanions", "Bilingual links")}
        ${graphToggle("showPathEdges", "Path links")}
        ${graphSlider("nodeScale", "Node size", 0.7, 1.8, 0.1)}
        ${graphSlider("linkScale", "Link thickness", 0.6, 2, 0.1)}
        ${graphSlider("repel", "Repel force", 0.7, 2.2, 0.1)}
        ${graphSlider("distance", "Link distance", 0.7, 2.2, 0.1)}
      </div>
    </details>
    `}
    <div class="graph-legend" aria-label="Relationship legend">
      ${isTree
    ? `<span><i class="legend-dot root"></i>Project</span>
        <span><i class="legend-dot module"></i>Module</span>
        <span><i class="legend-dot doc"></i>Document</span>`
    : `<span><i class="legend-dot references"></i>Primary reference</span>
        <span><i class="legend-dot companion"></i>Language companion</span>
        <span><i class="legend-dot path"></i>Navigation path</span>`}
    </div>
    <div class="graph-stage ${isTree ? "structure-stage" : ""}">
      <div id="concept-map" class="concept-map ${isTree ? "structure-map" : ""}" role="img" aria-label="Interactive documentation concept map"></div>
    </div>
  `;

  renderMapToc(isTree ? tree : graph, isTree ? "tree" : "graph");
  bindGraphScopeControls();
  bindMapModeControls();
  if (isTree) await mountStructureTree(tree);
  else await mountGraph(graph);
  content.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function mapModeButton(value, label, hint) {
  const active = state.mapMode === value ? "active" : "";
  return `
    <button class="graph-view-tab ${active}" type="button" data-map-mode="${value}">
      <span>${escapeHtml(label)}</span>
      <small>${escapeHtml(hint)}</small>
    </button>
  `;
}

function graphScopeButton(value, label, hint) {
  const active = state.lang === value ? "active" : "";
  return `
    <button class="graph-scope ${active}" type="button" data-graph-scope="${value}">
      <span>${escapeHtml(label)}</span>
      <small>${escapeHtml(hint)}</small>
    </button>
  `;
}

function graphModeButton(value, label, hint) {
  const active = state.graphSettings.mode === value ? "active" : "";
  return `
    <button class="graph-scope ${active}" type="button" data-graph-mode="${value}">
      <span>${escapeHtml(label)}</span>
      <small>${escapeHtml(hint)}</small>
    </button>
  `;
}

function depthButton(depth) {
  const active = state.graphSettings.depth === depth ? "active" : "";
  return `<button class="graph-depth ${active}" type="button" data-graph-depth="${depth}">${depth}</button>`;
}

function graphToggle(key, label) {
  const checked = state.graphSettings[key] ? "checked" : "";
  return `
    <label class="graph-toggle">
      <input type="checkbox" data-graph-setting="${key}" ${checked} />
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function graphSlider(key, label, min, max, step) {
  const value = state.graphSettings[key];
  return `
    <label class="graph-slider">
      <span>${escapeHtml(label)}</span>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-graph-setting="${key}" />
    </label>
  `;
}

function bindGraphScopeControls() {
  document.querySelectorAll("[data-graph-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.graphScope;
      renderNav();
      renderConceptMap().catch(showGraphError);
    });
  });
  document.querySelectorAll("[data-graph-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.graphSettings.mode = button.dataset.graphMode;
      renderConceptMap().catch(showGraphError);
    });
  });
  document.querySelectorAll("[data-graph-depth]").forEach((button) => {
    button.addEventListener("click", () => {
      state.graphSettings.depth = Number(button.dataset.graphDepth);
      state.graphSettings.mode = "local";
      renderConceptMap().catch(showGraphError);
    });
  });
  document.querySelectorAll("[data-graph-setting]").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.graphSetting;
      state.graphSettings[key] = input.type === "checkbox" ? input.checked : Number(input.value);
      state.graphSettingsOpen = true;
      renderConceptMap().catch(showGraphError);
    });
  });
  document.querySelector(".graph-settings")?.addEventListener("toggle", (event) => {
    state.graphSettingsOpen = event.currentTarget.open;
  });
}

function bindMapModeControls() {
  document.querySelectorAll("[data-map-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mapMode = button.dataset.mapMode;
      renderConceptMap().catch(showGraphError);
    });
  });
}

const structureBuckets = [
  {
    id: "start",
    label: "Entry",
    hint: "Start or resume project context",
    sections: ["Start", "中文入口"]
  },
  {
    id: "definition",
    label: "Product",
    hint: "Problem, scope, and delivery plan",
    sections: ["Project", "Planning", "中文项目", "中文规划"]
  },
  {
    id: "research",
    label: "Evidence",
    hint: "Research inputs and technical decisions",
    sections: ["Research", "中文研究"]
  },
  {
    id: "operations",
    label: "Operating Model",
    hint: "How AI collaboration and docs are governed",
    sections: ["Workflow", "中文工作流"]
  },
  {
    id: "modules",
    label: "Modules",
    hint: "Reusable capabilities with independent ownership",
    sections: ["Module Passports", "中文模块 Passport"]
  }
];

const structureSectionLabels = {
  Start: "Session Entry",
  Project: "Product Context",
  Planning: "Work Plan",
  Research: "Technical Research",
  Workflow: "Documentation Ops",
  "Module Passports": "Module Passport",
  中文入口: "中文入口",
  中文项目: "中文项目",
  中文规划: "中文规划",
  中文研究: "中文研究",
  中文工作流: "文档运营",
  "中文模块 Passport": "模块 Passport"
};

const structureChineseSectionLabels = {
  中文入口: "入口",
  中文项目: "项目",
  中文规划: "规划",
  中文研究: "研究",
  中文工作流: "文档运营",
  "中文模块 Passport": "模块 Passport"
};

function displaySectionLabel(section) {
  if (state.lang === "zh-CN" || state.path === "zh") {
    return structureChineseSectionLabels[section] ?? structureSectionLabels[section] ?? section;
  }
  return structureSectionLabels[section] ?? section;
}

const structureSubgroups = {
  Workflow: [
    {
      id: "system",
      label: "Reading System",
      hint: "Docs site, navigation, and IA",
      sources: [
        "docs/documentation-system.md",
        "docs/docs-site.md",
        "docs/information-architecture.md"
      ]
    },
    {
      id: "map",
      label: "Structure Views",
      hint: "Tree, graph, and map rendering decisions",
      sources: [
        "docs/concept-map-research.md",
        "docs/obsidian-graph-open-source-research.md",
        "docs/mind-map-library-evaluation.md",
        "docs/navigation-map-research.md"
      ]
    },
    {
      id: "collaboration",
      label: "Agent Workflow",
      hint: "Session, skill, and execution habits",
      sources: [
        "docs/document-engineering-workflow.md",
        "docs/skill-usage-policy.md",
        "docs/session-continuity.md"
      ]
    },
    {
      id: "governance",
      label: "Reuse Rules",
      hint: "Discovery gates and module governance",
      sources: [
        "docs/module-governance-first.md",
        "docs/reuse-first-discovery-gate.md",
        "docs/skills-research.md"
      ]
    },
    {
      id: "audit",
      label: "Audit Trail",
      hint: "Logs and retrospectives",
      sources: [
        "docs/skill-usage-log.md",
        "docs/workflow-retrospective.md"
      ]
    }
  ],
  "中文工作流": [
    {
      id: "system",
      label: "阅读系统",
      hint: "文档站、导航和信息架构",
      sources: [
        "docs/zh-CN/documentation-system.md",
        "docs/zh-CN/docs-site.md",
        "docs/zh-CN/information-architecture.md"
      ]
    },
    {
      id: "map",
      label: "结构视图",
      hint: "树、图和概念图渲染决策",
      sources: [
        "docs/zh-CN/concept-map-research.md",
        "docs/zh-CN/obsidian-graph-open-source-research.md",
        "docs/zh-CN/mind-map-library-evaluation.md",
        "docs/zh-CN/navigation-map-research.md"
      ]
    },
    {
      id: "collaboration",
      label: "Agent 工作流",
      hint: "Session、Skill 和执行习惯",
      sources: [
        "docs/zh-CN/document-engineering-workflow.md",
        "docs/zh-CN/skill-usage-policy.md",
        "docs/zh-CN/session-continuity.md"
      ]
    },
    {
      id: "governance",
      label: "复用规则",
      hint: "发现门禁和模块治理",
      sources: [
        "docs/zh-CN/module-governance-first.md",
        "docs/zh-CN/reuse-first-discovery-gate.md",
        "docs/zh-CN/skills-research.md"
      ]
    },
    {
      id: "audit",
      label: "审计线索",
      hint: "日志和复盘",
      sources: [
        "docs/zh-CN/skill-usage-log.md",
        "docs/zh-CN/workflow-retrospective.md"
      ]
    }
  ]
};

const structureDocLabels = {
  ".codex/handoffs/current.md": "Handoff",
  "docs/prd.md": "PRD",
  "docs/issue-breakdown-draft.md": "Issue Draft",
  "docs/project-management.md": "PM Workflow",
  "docs/workflow-overview.md": "Workflow",
  "docs/existing-tools-and-algorithms.md": "Tools",
  "docs/component-clustering-strategy.md": "Clustering",
  "docs/design-token-extraction.md": "Tokens",
  "docs/open-questions.md": "Questions",
  "docs/documentation-system.md": "Docs System",
  "docs/document-engineering-workflow.md": "Doc Workflow",
  "docs/skill-usage-policy.md": "Skill Policy",
  "docs/skill-usage-log.md": "Skill Log",
  "docs/session-continuity.md": "Session",
  "docs/workflow-retrospective.md": "Retrospective",
  "docs/docs-site.md": "Docs Site",
  "docs/information-architecture.md": "IA",
  "docs/concept-map-research.md": "Concept Map",
  "docs/obsidian-graph-open-source-research.md": "Obsidian",
  "docs/mind-map-library-evaluation.md": "Mind Map",
  "docs/navigation-map-research.md": "Map Nav",
  "docs/module-governance-first.md": "Module First",
  "docs/reuse-first-discovery-gate.md": "Reuse Gate",
  "docs/module-passports/documentation-system.md": "Docs Passport",
  "docs/skills-research.md": "Skills",
  "docs/zh-CN/issue-breakdown-draft.md": "Issue 拆分",
  "docs/zh-CN/index.md": "文档入口",
  "docs/zh-CN/project-management.md": "项目管理",
  "docs/zh-CN/workflow-overview.md": "工作流",
  "docs/zh-CN/existing-tools-and-algorithms.md": "现成工具",
  "docs/zh-CN/component-clustering-strategy.md": "组件聚类",
  "docs/zh-CN/design-token-extraction.md": "Token 提取",
  "docs/zh-CN/open-questions.md": "开放问题",
  "docs/zh-CN/document-engineering-workflow.md": "文档工程",
  "docs/zh-CN/skill-usage-policy.md": "Skill 规范",
  "docs/zh-CN/skill-usage-log.md": "Skill 日志",
  "docs/zh-CN/session-continuity.md": "Session",
  "docs/zh-CN/workflow-retrospective.md": "复盘",
  "docs/zh-CN/information-architecture.md": "信息架构",
  "docs/zh-CN/concept-map-research.md": "概念图",
  "docs/zh-CN/obsidian-graph-open-source-research.md": "Obsidian",
  "docs/zh-CN/mind-map-library-evaluation.md": "思维导图",
  "docs/zh-CN/navigation-map-research.md": "地图导航",
  "docs/zh-CN/module-governance-first.md": "模块优先",
  "docs/zh-CN/reuse-first-discovery-gate.md": "复用门禁",
  "docs/zh-CN/module-passports/documentation-system.md": "文档 Passport",
  "docs/zh-CN/skills-research.md": "Skills"
};

function buildStructureTree() {
  const docs = filteredDocs().slice().sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  const used = new Set();
  const children = structureBuckets.map((bucket) => {
    const bucketDocs = docs.filter((doc) => bucket.sections.includes(doc.section));
    bucketDocs.forEach((doc) => used.add(doc.source));
    return structureBucketNode(bucket, bucketDocs);
  }).filter((bucket) => bucket.children.length);

  const otherDocs = docs.filter((doc) => !used.has(doc.source));
  if (otherDocs.length) {
    children.push(structureBucketNode({
      id: "reference",
      label: "Reference",
      hint: "Documents outside the primary lifecycle",
      sections: [...new Set(otherDocs.map((doc) => doc.section))]
    }, otherDocs));
  }

  return {
    id: "root",
    label: "Design Recovery",
    hint: activePathLabel(),
    kind: "root",
    docCount: docs.length,
    children
  };
}

function structureBucketNode(bucket, docs) {
  const sectionGroups = groupDocs(docs);
  return {
    id: `bucket:${bucket.id}`,
    label: bucket.label,
    hint: bucket.hint,
    kind: "bucket",
    docCount: docs.length,
    children: Object.entries(sectionGroups).map(([section, sectionDocs]) => structureSectionNode(bucket, section, sectionDocs))
  };
}

function structureSectionNode(bucket, section, docs) {
  const groups = structureSubgroups[section];
  return {
    id: `section:${bucket.id}:${section}`,
    label: displaySectionLabel(section),
    hint: `${docs.length} docs`,
    kind: "section",
    docCount: docs.length,
    children: groups ? structureTopicNodes(bucket, section, docs, groups) : docs.map(structureDocNode)
  };
}

function structureTopicNodes(bucket, section, docs, groups) {
  const docBySource = new Map(docs.map((doc) => [doc.source, doc]));
  const used = new Set();
  const topics = groups.map((group) => {
    const groupDocs = group.sources.map((source) => docBySource.get(source)).filter(Boolean);
    groupDocs.forEach((doc) => used.add(doc.source));
    return {
      id: `topic:${bucket.id}:${section}:${group.id}`,
      label: group.label,
      hint: group.hint,
      kind: "topic",
      docCount: groupDocs.length,
      children: groupDocs.map(structureDocNode)
    };
  }).filter((topic) => topic.children.length);

  const uncategorized = docs.filter((doc) => !used.has(doc.source));
  if (uncategorized.length) {
    topics.push({
      id: `topic:${bucket.id}:${section}:other`,
      label: "Other",
      hint: "Unclassified documents",
      kind: "topic",
      docCount: uncategorized.length,
      children: uncategorized.map(structureDocNode)
    });
  }
  return topics;
}

function structureDocNode(doc) {
  return {
    id: doc.source,
    label: structureDocLabels[doc.source] ?? doc.title,
    hint: doc.title,
    kind: "doc",
    doc
  };
}

async function loadMindElixir() {
  if (!document.querySelector("#mind-elixir-style")) {
    const link = document.createElement("link");
    link.id = "mind-elixir-style";
    link.rel = "stylesheet";
    link.href = "/vendor/mind-elixir/MindElixir.css?v=mind-elixir";
    document.head.appendChild(link);
  }
  if (!state.mindElixir) {
    const module = await import("/vendor/mind-elixir/MindElixir.js?v=mind-elixir");
    state.mindElixir = module.default;
  }
  return state.mindElixir;
}

async function mountStructureTree(tree) {
  const container = document.querySelector("#concept-map");
  if (!container) return;
  try {
    await mountMindElixirTree(tree, container);
  } catch (error) {
    console.warn("Mind Elixir structure tree failed, falling back to SVG.", error);
    mountSvgStructureTree(tree, container);
  }
}

async function mountMindElixirTree(tree, container) {
  destroyStructureTree();
  if (state.graphInstance) {
    state.graphInstance.destroy();
    state.graphInstance = null;
  }
  if (state.graphCanvas?.destroy) {
    state.graphCanvas.destroy();
    state.graphCanvas = null;
  }
  delete window.__graphCanvas;
  delete window.__graphCy;

  const MindElixir = await loadMindElixir();
  const data = mindElixirDataFromStructureTree(tree);
  const docSourceByMindId = new Map();
  indexMindElixirDocs(data.nodeData, docSourceByMindId);
  container.innerHTML = `<div class="mind-elixir-host" data-tree-renderer="mind-elixir" data-node-count="${countStructureNodes(tree)}" data-doc-count="${tree.docCount}"></div>`;
  const host = container.querySelector(".mind-elixir-host");

  const mind = new MindElixir({
    el: host,
    direction: MindElixir.RIGHT,
    editable: false,
    contextMenu: false,
    toolBar: true,
    keypress: false,
    allowUndo: false,
    overflowHidden: false,
    alignment: "root",
    scaleMin: 0.35,
    scaleMax: 2.4,
    scaleSensitivity: 0.12,
    theme: structureMindElixirTheme()
  });

  const initError = mind.init(data);
  if (initError) throw initError;
  mind.bus.addListener("selectNodes", (nodes) => {
    const selected = nodes?.[0];
    const source = selected?.metadata?.docSource ?? (selected ? mindElixirDocSource(docSourceByMindId, selected.id) : null);
    if (source) loadDoc(source);
  });
  const unbindDocClicks = bindMindElixirDocClicks(host, docSourceByMindId);
  requestAnimationFrame(() => {
    mind.scale(0.78);
    mind.move(-360, -250);
  });

  state.structureTreeInstance = {
    kind: "mind-elixir",
    mind,
    destroy() {
      unbindDocClicks();
      mind.destroy();
    }
  };
  window.__mindElixirTree = mind;
}

function bindMindElixirDocClicks(host, docSourceByMindId) {
  const clickListener = (event) => {
    const topic = event.target.closest?.("me-tpc[data-nodeid]");
    if (!topic || !host.contains(topic)) return;
    const source = mindElixirDocSource(docSourceByMindId, topic.dataset.nodeid);
    host.dataset.lastSelectedId = topic.dataset.nodeid;
    host.dataset.lastSelectedSource = source ?? "";
    if (!source) return;
    event.preventDefault();
    event.stopPropagation();
    loadDoc(source);
  };
  host.dataset.clickAdapter = "doc-open";
  host.addEventListener("click", clickListener, true);
  return () => host.removeEventListener("click", clickListener, true);
}

function mindElixirDocSource(docSourceByMindId, id) {
  if (!id) return null;
  return docSourceByMindId.get(id) ?? docSourceByMindId.get(id.replace(/^me/, "")) ?? null;
}

function mountSvgStructureTree(tree, container = document.querySelector("#concept-map")) {
  if (!container) return;
  destroyStructureTree();
  const layout = layoutStructureTree(tree);
  container.innerHTML = renderStructureSvg(layout);
  container.querySelectorAll("[data-tree-doc]").forEach((node) => {
    node.addEventListener("click", () => loadDoc(node.dataset.treeDoc));
  });
  state.structureTreeInstance = {
    kind: "svg",
    destroy() {
      container.innerHTML = "";
    }
  };
}

function destroyStructureTree() {
  if (state.structureTreeInstance?.destroy) {
    state.structureTreeInstance.destroy();
    state.structureTreeInstance = null;
  }
  delete window.__mindElixirTree;
}

function mindElixirDataFromStructureTree(tree) {
  return {
    nodeData: mindElixirNodeFromStructureNode(tree, 0),
    direction: 1,
    theme: structureMindElixirTheme()
  };
}

function mindElixirNodeFromStructureNode(node, depth) {
  const id = mindElixirNodeId(node);
  return {
    id,
    topic: node.label,
    expanded: depth < 3,
    tags: node.kind === "doc" ? [] : [`${node.docCount ?? ""} docs`.trim()],
    style: mindElixirNodeStyle(node.kind),
    metadata: {
      kind: node.kind,
      docSource: node.kind === "doc" ? node.id : null,
      hint: node.hint ?? ""
    },
    children: (node.children ?? []).map((child) => mindElixirNodeFromStructureNode(child, depth + 1))
  };
}

function mindElixirNodeId(node) {
  let hash = 0;
  const input = `${node.kind}:${node.id}`;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }
  return `me-${Math.abs(hash).toString(36)}`;
}

function indexMindElixirDocs(node, target) {
  if (node.metadata?.docSource) target.set(node.id, node.metadata.docSource);
  for (const child of node.children ?? []) indexMindElixirDocs(child, target);
}

function countStructureNodes(node) {
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countStructureNodes(child), 0);
}

function mindElixirNodeStyle(kind) {
  if (kind === "root") {
    return {
      background: "#e8f2fb",
      color: "#123a59",
      border: "2px solid #1769aa",
      fontWeight: "850"
    };
  }
  if (kind === "bucket") {
    return {
      background: "#fff7e8",
      color: "#4d3411",
      border: "1px solid #d6aa5c",
      fontWeight: "850"
    };
  }
  if (kind === "section") {
    return {
      background: "#f8fafc",
      color: "#17202a",
      border: "1px solid #d7e0e8",
      fontWeight: "800"
    };
  }
  if (kind === "topic") {
    return {
      background: "#f4fbf6",
      color: "#173f28",
      border: "1px solid #9fc9aa",
      fontWeight: "780"
    };
  }
  return {
    background: "#ffffff",
    color: "#17202a",
    border: "1px solid #d7e0e8",
    fontWeight: "700"
  };
}

function structureMindElixirTheme() {
  return {
    name: "Docs Structure",
    palette: ["#1769aa", "#d6aa5c", "#5d7590", "#5d9a6f", "#a85d6a", "#6d6ab5"],
    cssVar: {
      "--node-gap-x": "34px",
      "--node-gap-y": "10px",
      "--main-gap-x": "74px",
      "--main-gap-y": "42px",
      "--root-radius": "8px",
      "--main-radius": "8px",
      "--root-color": "#123a59",
      "--root-bgcolor": "#e8f2fb",
      "--root-border-color": "#1769aa",
      "--main-color": "#17202a",
      "--main-bgcolor": "#ffffff",
      "--main-bgcolor-transparent": "rgba(255,255,255,0.84)",
      "--topic-padding": "7px 11px",
      "--color": "#17202a",
      "--bgcolor": "#fbfcfd",
      "--selected": "#1769aa",
      "--accent-color": "#1769aa",
      "--panel-color": "#17202a",
      "--panel-bgcolor": "#ffffff",
      "--panel-border-color": "#d7e0e8",
      "--map-padding": "56px 96px"
    }
  };
}

function layoutStructureTree(tree) {
  const nodes = [];
  const edges = [];
  const leafGap = 62;
  const levelGap = 280;
  const margin = { top: 46, right: 48, bottom: 46, left: 44 };
  let leafIndex = 0;

  const place = (node, depth = 0, parent = null) => {
    const children = node.children ?? [];
    const placedChildren = children.map((child) => place(child, depth + 1, node));
    const y = depth === 0
      ? margin.top + 32
      : placedChildren.length
      ? placedChildren.reduce((sum, child) => sum + child.y, 0) / placedChildren.length
      : margin.top + leafIndex++ * leafGap;
    const width = node.kind === "doc" ? 220 : node.kind === "section" ? 190 : 230;
    const height = node.kind === "doc" ? 46 : 54;
    const item = {
      node,
      parent,
      depth,
      x: margin.left + depth * levelGap,
      y,
      width,
      height
    };
    nodes.push(item);
    for (const child of placedChildren) edges.push({ source: item, target: child });
    return item;
  };

  place(tree);
  const maxDepth = Math.max(0, ...nodes.map((node) => node.depth));
  const maxY = Math.max(margin.top, ...nodes.map((node) => node.y)) + margin.bottom;
  return {
    nodes,
    edges,
    width: margin.left + maxDepth * levelGap + 300 + margin.right,
    height: Math.max(620, maxY),
    tree
  };
}

function renderStructureSvg(layout) {
  return `
    <svg class="structure-svg" data-tree-renderer="svg" data-node-count="${layout.nodes.length}" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-label="Project documentation structure tree">
      <g class="structure-links">
        ${layout.edges.map(renderStructureEdge).join("")}
      </g>
      <g class="structure-nodes">
        ${layout.nodes.map(renderStructureNode).join("")}
      </g>
    </svg>
  `;
}

function renderStructureEdge(edge) {
  const sx = edge.source.x + edge.source.width;
  const sy = edge.source.y;
  const tx = edge.target.x;
  const ty = edge.target.y;
  const mid = sx + Math.max(48, (tx - sx) * 0.45);
  return `<path class="structure-link" d="M ${sx} ${sy} C ${mid} ${sy}, ${mid} ${ty}, ${tx} ${ty}" />`;
}

function renderStructureNode(item) {
  const { node } = item;
  const x = item.x;
  const y = item.y - item.height / 2;
  const title = truncateLabel(node.label, node.kind === "doc" ? 28 : 24);
  const hint = truncateLabel(node.hint ?? "", node.kind === "doc" ? 32 : 26);
  const count = node.kind !== "doc" && node.docCount ? `<text class="structure-count" x="${x + item.width - 18}" y="${y + 24}">${node.docCount}</text>` : "";
  const docAttr = node.kind === "doc" ? `data-tree-doc="${escapeHtml(node.id)}" tabindex="0"` : "";
  return `
    <g class="structure-node ${node.kind}" ${docAttr} transform="translate(${x} ${y})">
      <rect width="${item.width}" height="${item.height}" rx="8" />
      <text class="structure-title" x="14" y="${node.kind === "doc" ? 20 : 22}">${escapeHtml(title)}</text>
      <text class="structure-hint" x="14" y="${node.kind === "doc" ? 36 : 40}">${escapeHtml(hint)}</text>
      ${count}
    </g>
  `;
}

function truncateLabel(value, maxLength) {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

async function loadCytoscape() {
  if (!state.cytoscape) {
    const module = await import("/vendor/cytoscape.esm.min.mjs?v=cytoscape");
    state.cytoscape = module.default;
  }
  return state.cytoscape;
}

async function mountGraph(graph) {
  destroyStructureTree();
  try {
    mountCanvasGraph(graph);
  } catch (error) {
    console.warn("Canvas graph failed, falling back to Cytoscape.", error);
    await mountCytoscapeGraph(graph);
  }
}

function mountCanvasGraph(graph) {
  const container = document.querySelector("#concept-map");
  if (!container) return;
  if (state.graphInstance) {
    state.graphInstance.destroy();
    state.graphInstance = null;
  }
  if (state.graphCanvas?.destroy) state.graphCanvas.destroy();
  container.innerHTML = `<canvas class="graph-canvas" aria-label="GraphFrontier-style documentation graph"></canvas>`;

  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const model = createCanvasGraphModel(graph);
  const edgePairs = model.edges.map((edge) => ({
    ...edge,
    sourceNode: model.nodeById.get(edge.source),
    targetNode: model.nodeById.get(edge.target)
  })).filter((edge) => edge.sourceNode && edge.targetNode);

  const view = {
    graph,
    canvas,
    ctx,
    model,
    edges: edgePairs,
    scale: 1,
    tx: 0,
    ty: 0,
    hoverId: null,
    selectedId: null,
    focusProgress: 0,
    pointer: null,
    draggingNode: null,
    draggingCanvas: false,
    lastPointer: null,
    animationId: null,
    destroyed: false,
    settledTicks: 0
  };
  canvas.dataset.graphRenderer = "canvas";
  canvas.dataset.nodeCount = String(model.nodes.length);
  canvas.dataset.edgeCount = String(edgePairs.length);
  canvas.dataset.scale = "1";

  resizeCanvasGraph(view);
  seedCanvasGraph(view);
  const unbindCanvasGraphEvents = bindCanvasGraphEvents(view);
  runCanvasGraphFrame(view);

  state.graphCanvas = {
    view,
    destroy() {
      view.destroyed = true;
      if (view.animationId) cancelAnimationFrame(view.animationId);
      unbindCanvasGraphEvents();
    }
  };
  window.__graphCanvas = view;
}

function createCanvasGraphModel(graph) {
  const degreeByNode = graphDegreeByNode(graph);
  const nodes = graph.nodes.map((node) => ({
    ...node,
    degree: degreeByNode.get(node.id) ?? 0,
    radius: canvasNodeRadius(node, degreeByNode.get(node.id) ?? 0),
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    pinned: false
  }));
  return {
    nodes,
    edges: graph.edges,
    nodeById: new Map(nodes.map((node) => [node.id, node]))
  };
}

function canvasNodeRadius(node, degree) {
  const base = node.kind === "path" ? 6 : 3.2;
  return Math.max(2.6, Math.min(9.5, (base + Math.log2(degree + 2) * 1.5) * state.graphSettings.nodeScale));
}

function resizeCanvasGraph(view) {
  const rect = view.canvas.parentElement.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  view.width = Math.max(320, rect.width);
  view.height = Math.max(480, rect.height);
  view.dpr = dpr;
  view.canvas.width = Math.floor(view.width * dpr);
  view.canvas.height = Math.floor(view.height * dpr);
  view.canvas.style.width = `${view.width}px`;
  view.canvas.style.height = `${view.height}px`;
  view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function seedCanvasGraph(view) {
  const { nodes } = view.model;
  const count = Math.max(1, nodes.length);
  const radius = Math.min(view.width, view.height) * 0.28;
  const centerX = view.width / 2;
  const centerY = view.height / 2;
  nodes.forEach((node, index) => {
    const angle = (index / count) * Math.PI * 2;
    const ringNoise = 0.72 + ((index * 37) % 23) / 80;
    node.x = centerX + Math.cos(angle) * radius * ringNoise;
    node.y = centerY + Math.sin(angle) * radius * ringNoise;
    node.vx = 0;
    node.vy = 0;
  });
}

function bindCanvasGraphEvents(view) {
  const canvas = view.canvas;
  const updatePointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    view.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    return view.pointer;
  };

  canvas.addEventListener("pointermove", (event) => {
    const pointer = updatePointer(event);
    const world = screenToWorld(view, pointer.x, pointer.y);
    if (view.draggingNode) {
      view.draggingNode.x = world.x;
      view.draggingNode.y = world.y;
      view.draggingNode.vx = 0;
      view.draggingNode.vy = 0;
      view.draggingNode.pinned = true;
      view.settledTicks = 0;
      return;
    }
    if (view.draggingCanvas && view.lastPointer) {
      view.tx += pointer.x - view.lastPointer.x;
      view.ty += pointer.y - view.lastPointer.y;
      view.lastPointer = pointer;
      return;
    }
    const hover = findCanvasNodeAt(view, pointer.x, pointer.y);
    view.hoverId = hover?.id ?? null;
    canvas.dataset.hoverId = view.hoverId ?? "";
  });

  canvas.addEventListener("pointerdown", (event) => {
    canvas.setPointerCapture(event.pointerId);
    const pointer = updatePointer(event);
    const hit = findCanvasNodeAt(view, pointer.x, pointer.y);
    view.lastPointer = pointer;
    if (hit) {
      view.draggingNode = hit;
      view.selectedId = hit.id;
      renderGraphToc(view.graph, null, null, canvasNodeDetails(view, hit));
    } else {
      view.draggingCanvas = true;
      view.selectedId = null;
      renderGraphToc(view.graph);
    }
  });

  canvas.addEventListener("pointerup", () => {
    view.draggingNode = null;
    view.draggingCanvas = false;
    view.lastPointer = null;
  });

  canvas.addEventListener("pointerleave", () => {
    view.hoverId = null;
    view.draggingNode = null;
    view.draggingCanvas = false;
  });

  canvas.addEventListener("dblclick", (event) => {
    const pointer = updatePointer(event);
    const hit = findCanvasNodeAt(view, pointer.x, pointer.y);
    if (!hit) return;
    if (hit.kind === "doc") loadDoc(hit.id);
    if (hit.kind === "path") {
      state.path = hit.id.replace(/^path:/, "");
      renderNav();
      renderConceptMap().catch(showGraphError);
    }
  });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const pointer = updatePointer(event);
    const before = screenToWorld(view, pointer.x, pointer.y);
    const factor = Math.exp(-event.deltaY * 0.0012);
    view.scale = Math.max(0.22, Math.min(3.2, view.scale * factor));
    const after = worldToScreen(view, before.x, before.y);
    view.tx += pointer.x - after.x;
    view.ty += pointer.y - after.y;
    canvas.dataset.scale = view.scale.toFixed(3);
  }, { passive: false });

  const resizeListener = () => {
    if (view.destroyed) return;
    resizeCanvasGraph(view);
  };
  window.addEventListener("resize", resizeListener);

  return () => {
    window.removeEventListener("resize", resizeListener);
  };
}

function runCanvasGraphFrame(view) {
  if (view.destroyed) return;
  if (view.settledTicks < 260) {
    stepCanvasPhysics(view);
    view.settledTicks += 1;
  }
  drawCanvasGraph(view);
  view.animationId = requestAnimationFrame(() => runCanvasGraphFrame(view));
}

function stepCanvasPhysics(view) {
  const nodes = view.model.nodes;
  const edges = view.edges;
  const repel = 1100 * state.graphSettings.repel;
  const linkDistance = 92 * state.graphSettings.distance;
  const centerX = view.width / 2;
  const centerY = view.height / 2;

  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const b = nodes[j];
      const dx = a.x - b.x || 0.01;
      const dy = a.y - b.y || 0.01;
      const distSq = Math.max(120, dx * dx + dy * dy);
      const force = repel / distSq;
      const fx = dx * force;
      const fy = dy * force;
      if (!a.pinned) {
        a.vx += fx;
        a.vy += fy;
      }
      if (!b.pinned) {
        b.vx -= fx;
        b.vy -= fy;
      }
    }
  }

  for (const edge of edges) {
    const source = edge.sourceNode;
    const target = edge.targetNode;
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const desired = edge.type === "references" ? linkDistance : linkDistance * 1.25;
    const strength = edge.type === "references" ? 0.012 : 0.006;
    const force = (dist - desired) * strength;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    if (!source.pinned) {
      source.vx += fx;
      source.vy += fy;
    }
    if (!target.pinned) {
      target.vx -= fx;
      target.vy -= fy;
    }
  }

  for (const node of nodes) {
    if (!node.pinned) {
      node.vx += (centerX - node.x) * 0.0018;
      node.vy += (centerY - node.y) * 0.0018;
      node.x += node.vx;
      node.y += node.vy;
    }
    node.vx *= 0.82;
    node.vy *= 0.82;
  }
}

function drawCanvasGraph(view) {
  const { ctx } = view;
  ctx.save();
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  ctx.fillStyle = "#11151c";
  ctx.fillRect(0, 0, view.width, view.height);
  drawCanvasGrid(view);
  ctx.translate(view.tx, view.ty);
  ctx.scale(view.scale, view.scale);

  const focusId = view.hoverId || view.selectedId;
  const focusNeighbors = focusId ? canvasNeighborSet(view, focusId) : null;
  view.focusProgress += ((focusId ? 1 : 0) - view.focusProgress) * 0.18;

  for (const edge of view.edges) drawCanvasEdge(view, edge, focusNeighbors);
  for (const node of view.model.nodes) drawCanvasNode(view, node, focusId, focusNeighbors);
  ctx.restore();

  const focusedNode = view.model.nodeById.get(focusId);
  if (focusedNode) drawCanvasLabelBubble(view, focusedNode);
}

function drawCanvasGrid(view) {
  const { ctx } = view;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  const gap = 36;
  const ox = view.tx % gap;
  const oy = view.ty % gap;
  for (let x = ox; x < view.width; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, view.height);
    ctx.stroke();
  }
  for (let y = oy; y < view.height; y += gap) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(view.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCanvasEdge(view, edge, focusNeighbors) {
  const { ctx } = view;
  const relevant = !focusNeighbors || (focusNeighbors.has(edge.source) && focusNeighbors.has(edge.target));
  const alphaBase = edge.type === "references" ? 0.34 : edge.type === "companion" ? 0.16 : 0.08;
  const alpha = relevant ? alphaBase : Math.max(0.025, alphaBase * (1 - view.focusProgress * 0.86));
  ctx.strokeStyle = edge.type === "references"
    ? `rgba(139, 170, 202, ${alpha})`
    : edge.type === "companion"
      ? `rgba(214, 170, 92, ${alpha})`
      : `rgba(89, 146, 190, ${alpha})`;
  ctx.lineWidth = (edge.type === "references" ? 1.05 : 0.7) * state.graphSettings.linkScale / view.scale;
  ctx.beginPath();
  ctx.moveTo(edge.sourceNode.x, edge.sourceNode.y);
  ctx.lineTo(edge.targetNode.x, edge.targetNode.y);
  ctx.stroke();
}

function drawCanvasNode(view, node, focusId, focusNeighbors) {
  const { ctx } = view;
  const relevant = !focusNeighbors || focusNeighbors.has(node.id);
  const selected = node.id === view.selectedId;
  const hovered = node.id === view.hoverId;
  const alpha = relevant ? 1 : Math.max(0.08, 1 - view.focusProgress * 0.82);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.radius * (selected || hovered ? 1.45 : 1), 0, Math.PI * 2);
  ctx.fillStyle = node.kind === "path" ? "#59a9e8" : node.lang === "zh-CN" ? "#d6aa5c" : "#d9e7f5";
  ctx.shadowColor = selected || hovered ? "rgba(119, 190, 255, 0.9)" : "rgba(119, 190, 255, 0.18)";
  ctx.shadowBlur = selected || hovered ? 18 : 7;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = (selected ? 2.4 : 0.7) / view.scale;
  ctx.strokeStyle = selected ? "#91d5ff" : "rgba(255,255,255,0.5)";
  ctx.stroke();
  ctx.globalAlpha = 1;

  if (state.graphSettings.showLabels || view.scale > 1.45 || selected || hovered) {
    drawCanvasNodeLabel(view, node, selected || hovered ? 1 : alpha * 0.72);
  }
}

function drawCanvasNodeLabel(view, node, alpha) {
  const { ctx } = view;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${Math.max(9, 11 / view.scale)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillStyle = "rgba(238, 245, 255, 0.95)";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(node.label, node.x, node.y + node.radius + 5 / view.scale);
  ctx.restore();
}

function drawCanvasLabelBubble(view, node) {
  const { ctx } = view;
  const point = worldToScreen(view, node.x, node.y);
  const label = node.label || node.id;
  ctx.save();
  ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
  const width = Math.min(340, ctx.measureText(label).width + 18);
  const x = Math.max(10, Math.min(view.width - width - 10, point.x - width / 2));
  const y = Math.max(10, point.y - 38);
  ctx.fillStyle = "rgba(8, 11, 16, 0.78)";
  ctx.strokeStyle = "rgba(145, 213, 255, 0.55)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, width, 26, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + 9, y + 13, width - 18);
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function canvasNeighborSet(view, id) {
  const set = new Set([id]);
  for (const edge of view.edges) {
    if (edge.source === id) set.add(edge.target);
    if (edge.target === id) set.add(edge.source);
  }
  return set;
}

function findCanvasNodeAt(view, screenX, screenY) {
  const world = screenToWorld(view, screenX, screenY);
  let best = null;
  let bestDistance = Infinity;
  for (const node of view.model.nodes) {
    const distance = Math.hypot(world.x - node.x, world.y - node.y);
    const hitRadius = Math.max(8 / view.scale, node.radius + 4 / view.scale);
    if (distance <= hitRadius && distance < bestDistance) {
      best = node;
      bestDistance = distance;
    }
  }
  return best;
}

function screenToWorld(view, x, y) {
  return {
    x: (x - view.tx) / view.scale,
    y: (y - view.ty) / view.scale
  };
}

function worldToScreen(view, x, y) {
  return {
    x: x * view.scale + view.tx,
    y: y * view.scale + view.ty
  };
}

function canvasNodeDetails(view, node) {
  const connectedEdges = view.edges.filter((edge) => edge.source === node.id || edge.target === node.id);
  const references = connectedEdges.filter((edge) => edge.type === "references").length;
  const companions = connectedEdges.filter((edge) => edge.type === "companion").length;
  const pathLinks = connectedEdges.filter((edge) => edge.type === "path").length;
  const weightedDegree = connectedEdges.reduce((sum, edge) => sum + edgeWeight(edge), 0);
  const action = node.kind === "doc"
    ? `<button class="toc-action" type="button" onclick="window.__openGraphDoc('${escapeHtml(node.id)}')">Open document</button>`
    : "";
  return `
    <div class="toc-detail">
      <p class="toc-title">Selected</p>
      <strong>${escapeHtml(node.label)}</strong>
      <span>${escapeHtml(node.section ?? node.hint ?? node.id)}</span>
      <div class="toc-stat"><strong>${connectedEdges.length}</strong><span>relationships</span></div>
      <div class="toc-stat"><strong>${weightedDegree.toFixed(1)}</strong><span>weighted degree</span></div>
      <div class="toc-stat"><strong>${references}</strong><span>references</span></div>
      <div class="toc-stat"><strong>${companions}</strong><span>companions</span></div>
      <div class="toc-stat"><strong>${pathLinks}</strong><span>path links</span></div>
      ${action}
    </div>
  `;
}

async function mountCytoscapeGraph(graph) {
  const cytoscape = await loadCytoscape();
  const container = document.querySelector("#concept-map");
  if (!container) return;
  if (state.graphInstance) {
    state.graphInstance.destroy();
    state.graphInstance = null;
  }

  const degreeByNode = graphDegreeByNode(graph);
  const elements = [
    ...graph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        kind: node.kind,
        lang: node.lang,
        section: node.section,
        hint: node.hint,
        paths: node.paths ?? [],
        degree: degreeByNode.get(node.id) ?? 0,
        size: graphNodeSize(node, degreeByNode.get(node.id) ?? 0)
      },
      classes: `${node.kind} ${node.lang === "zh-CN" ? "zh" : ""}`
    })),
    ...graph.edges.map((edge, index) => ({
      data: {
        id: `edge:${index}:${edge.source}:${edge.target}:${edge.type}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.label,
        weight: edgeWeight(edge)
      },
      classes: `${edge.type} ${edgeWeightClass(edge)}`
    }))
  ];

  const cy = cytoscape({
    container,
    elements,
    minZoom: 0.28,
    maxZoom: 2.4,
    wheelSensitivity: 0.18,
    style: graphStyles(),
    layout: {
      name: "cose",
      animate: false,
      fit: true,
      padding: 76,
      nodeOverlap: 24,
      componentSpacing: 120,
      nodeRepulsion: 24000 * state.graphSettings.repel,
      idealEdgeLength: (edge) => (edge.data("type") === "references" ? 220 : 260) * state.graphSettings.distance,
      edgeElasticity: (edge) => edge.data("type") === "references" ? 0.18 : 0.08,
      nestingFactor: 1.15,
      gravity: 0.08,
      numIter: 2600
    }
  });

  cy.on("mouseover", "node", (event) => {
    const node = event.target;
    if (cy.nodes(".selected").length) return;
    node.closedNeighborhood().addClass("preview");
  });

  cy.on("mouseout", "node", () => {
    if (cy.nodes(".selected").length) return;
    cy.elements().removeClass("preview");
  });

  cy.on("tap", "node", (event) => {
    const node = event.target;
    focusGraphNode(cy, node);
    renderGraphToc(graph, node);
  });

  cy.on("tap", "edge", (event) => {
    renderGraphToc(graph, null, event.target);
  });

  cy.on("tap", (event) => {
    if (event.target === cy) {
      cy.elements().removeClass("faded selected neighborhood");
      renderGraphToc(graph);
    }
  });

  cy.on("dbltap", "node", (event) => {
    const node = event.target;
    if (node.data("kind") === "doc") loadDoc(node.id());
    if (node.data("kind") === "path") {
      state.path = node.id().replace(/^path:/, "");
      renderNav();
      renderConceptMap().catch(showGraphError);
    }
  });

  state.graphInstance = cy;
  window.__graphCy = cy;
}

function graphDegreeByNode(graph) {
  const degreeByNode = new Map(graph.nodes.map((node) => [node.id, 0]));
  for (const edge of graph.edges) {
    const weight = edgeWeight(edge);
    degreeByNode.set(edge.source, (degreeByNode.get(edge.source) ?? 0) + weight);
    degreeByNode.set(edge.target, (degreeByNode.get(edge.target) ?? 0) + weight);
  }
  return degreeByNode;
}

function graphNodeSize(node, degree) {
  const base = node.kind === "path" ? 18 : 11;
  return Math.round((base + Math.min(20, degree * 1.35)) * state.graphSettings.nodeScale);
}

function edgeWeight(edge) {
  if (edge.type === "references") return 1;
  if (edge.type === "companion") return 0.34;
  if (edge.type === "path") return 0.16;
  return 0.5;
}

function edgeWeightClass(edge) {
  const weight = edgeWeight(edge);
  if (weight >= 0.75) return "strong";
  if (weight >= 0.3) return "supporting";
  return "ambient";
}

function graphStyles() {
  return [
    {
      selector: "node",
      style: {
        "background-color": "#ffffff",
        "border-color": "#c8d3df",
        "border-opacity": 0.72,
        "border-width": 1.2,
        "color": "#17202a",
        "font-size": 10,
        "font-weight": 700,
        "height": "data(size)",
        "label": "data(label)",
        "line-height": 1.2,
        "min-zoomed-font-size": 7,
        "overlay-opacity": 0,
        "shape": "ellipse",
        "text-halign": "center",
        "text-margin-y": -11,
        "text-max-width": 92,
        "text-opacity": state.graphSettings.showLabels ? 0.82 : 0,
        "text-valign": "top",
        "text-wrap": "wrap",
        "width": "data(size)"
      }
    },
    {
      selector: "node.path",
      style: {
        "background-color": "#e6f2fb",
        "border-color": "#1769aa",
        "color": "#0f4f82",
        "height": "data(size)",
        "width": "data(size)"
      }
    },
    {
      selector: "node.zh",
      style: {
        "background-color": "#fff8ed",
        "border-color": "#d2aa64"
      }
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        "label": "",
        "line-color": "#9aacbf",
        "opacity": 0.28,
        "target-arrow-color": "#9aacbf",
        "target-arrow-shape": state.graphSettings.showArrows ? "triangle" : "none",
        "width": 0.9 * state.graphSettings.linkScale
      }
    },
    {
      selector: "edge.path",
      style: {
        "display": state.graphSettings.showPathEdges ? "element" : "none",
        "label": "",
        "line-color": "#1769aa",
        "target-arrow-color": "#1769aa",
        "width": 0.45 * state.graphSettings.linkScale,
        "opacity": 0.05,
        "target-arrow-shape": state.graphSettings.showArrows ? "triangle" : "none"
      }
    },
    {
      selector: "edge.companion",
      style: {
        "line-color": "#9a6a2f",
        "line-style": "dashed",
        "target-arrow-color": "#9a6a2f",
        "width": 0.7 * state.graphSettings.linkScale,
        "opacity": 0.12
      }
    },
    {
      selector: "edge.references",
      style: {
        "line-color": "#65727e",
        "target-arrow-color": "#65727e",
        "width": 1.25 * state.graphSettings.linkScale,
        "opacity": 0.36
      }
    },
    {
      selector: "edge.ambient",
      style: {
        "display": "element"
      }
    },
    {
      selector: "edge.supporting",
      style: {
        "opacity": state.lang === "all" ? 0.24 : 0.12
      }
    },
    {
      selector: ".faded",
      style: {
        "opacity": 0.08,
        "text-opacity": 0
      }
    },
    {
      selector: ".preview",
      style: {
        "opacity": 1,
        "text-opacity": state.graphSettings.showLabels ? 1 : 0
      }
    },
    {
      selector: ".neighborhood",
      style: {
        "opacity": 1,
        "text-opacity": state.graphSettings.showLabels ? 1 : 0
      }
    },
    {
      selector: "node.selected",
      style: {
        "border-color": "#0f4f82",
        "border-width": 3,
        "background-color": "#d8ebf8",
        "height": "data(size)",
        "text-opacity": 1,
        "width": "data(size)"
      }
    },
    {
      selector: "edge.selected",
      style: {
        "opacity": 1,
        "target-arrow-shape": "triangle",
        "width": 2.4 * state.graphSettings.linkScale
      }
    }
  ];
}

function focusGraphNode(cy, node) {
  const neighborhood = node.closedNeighborhood();
  cy.elements().addClass("faded").removeClass("selected neighborhood preview");
  neighborhood.removeClass("faded").addClass("neighborhood");
  node.addClass("selected");
  neighborhood.edges().addClass("selected");
}

function visibleGraph() {
  const docs = filteredDocs();
  const docIds = new Set(docs.map((doc) => doc.source));
  const pathIds = new Set();

  if (state.graphSettings.showPathEdges) {
    for (const doc of docs) {
      for (const path of doc.paths ?? []) {
        if (path !== "zh") pathIds.add(`path:${path}`);
      }
    }
  }

  const visibleIds = new Set([...docIds, ...pathIds]);
  let nodes = state.graph.nodes.filter((node) => visibleIds.has(node.id));
  let edges = state.graph.edges.filter((edge) => {
    if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return false;
    if (edge.type === "path" && !state.graphSettings.showPathEdges) return false;
    if (edge.type === "companion" && !state.graphSettings.showCompanions) return false;
    return true;
  });

  if (state.graphSettings.mode === "local") {
    const local = localGraph(nodes, edges);
    nodes = local.nodes;
    edges = local.edges;
  }

  return { nodes, edges, docCount: docs.length };
}

function localGraph(nodes, edges) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const root = state.active?.source && nodeIds.has(state.active.source)
    ? state.active.source
    : nodes.find((node) => node.kind === "doc")?.id;
  if (!root) return { nodes, edges };

  const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
  for (const edge of edges) {
    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  }

  const kept = new Set([root]);
  const queue = [{ id: root, depth: 0 }];
  while (queue.length) {
    const current = queue.shift();
    if (current.depth >= state.graphSettings.depth) continue;
    for (const next of adjacency.get(current.id) ?? []) {
      if (kept.has(next)) continue;
      kept.add(next);
      queue.push({ id: next, depth: current.depth + 1 });
    }
  }

  return {
    nodes: nodes.filter((node) => kept.has(node.id)),
    edges: edges.filter((edge) => kept.has(edge.source) && kept.has(edge.target))
  };
}

function renderMapToc(model, mode) {
  if (mode === "tree") renderStructureToc(model);
  else renderGraphToc(model);
}

function renderStructureToc(tree) {
  const toc = document.querySelector("#toc");
  const modules = tree.children ?? [];
  const sections = modules.flatMap((module) => module.children ?? []);
  const topics = sections.flatMap((section) => (section.children ?? []).filter((child) => child.kind === "topic"));
  toc.innerHTML = `
    <p class="toc-title">Structure</p>
    <div class="toc-stat"><strong>${tree.docCount}</strong><span>visible docs</span></div>
    <div class="toc-stat"><strong>${modules.length}</strong><span>lifecycle groups</span></div>
    <div class="toc-stat"><strong>${sections.length}</strong><span>sections</span></div>
    <div class="toc-stat"><strong>${topics.length}</strong><span>topics</span></div>
    <div class="toc-detail">
      <p class="toc-title">Reading Model</p>
      <strong>Project -> Module -> Section -> Topic -> Document</strong>
      <span>Dense sections are split into topic groups so the canonical project structure stays readable.</span>
    </div>
    <div class="toc-detail">
      <p class="toc-title">Groups</p>
      ${modules.map((module) => `
        <div class="toc-stat"><strong>${module.docCount}</strong><span>${escapeHtml(module.label)}</span></div>
      `).join("")}
    </div>
  `;
}

function renderGraphToc(graph, selectedNode = null, selectedEdge = null, selectedHtml = "") {
  const toc = document.querySelector("#toc");
  const byKind = graph.edges.reduce((counts, edge) => {
    counts[edge.type] = (counts[edge.type] ?? 0) + 1;
    return counts;
  }, {});
  const density = couplingSummary(graph);
  const selected = selectedHtml || (selectedNode ? selectedNodeDetails(selectedNode) : selectedEdge ? selectedEdgeDetails(selectedEdge) : "");
  toc.innerHTML = `
    <p class="toc-title">Graph</p>
    <div class="toc-stat"><strong>${graph.nodes.length}</strong><span>nodes</span></div>
    <div class="toc-stat"><strong>${graph.edges.length}</strong><span>edges</span></div>
    <div class="toc-stat"><strong>${byKind.path ?? 0}</strong><span>path links</span></div>
    <div class="toc-stat"><strong>${byKind.companion ?? 0}</strong><span>bilingual links</span></div>
    <div class="toc-stat"><strong>${byKind.references ?? 0}</strong><span>doc links</span></div>
    <div class="toc-stat"><strong>${density.maxDegree}</strong><span>max degree</span></div>
    <div class="toc-stat"><strong>${density.highCouplingNodes}</strong><span>high coupling</span></div>
    ${selected}
  `;
}

function selectedNodeDetails(node) {
  const connectedEdges = node.connectedEdges();
  const references = connectedEdges.filter((edge) => edge.data("type") === "references").length;
  const companions = connectedEdges.filter((edge) => edge.data("type") === "companion").length;
  const pathLinks = connectedEdges.filter((edge) => edge.data("type") === "path").length;
  const weightedDegree = connectedEdges.reduce((sum, edge) => sum + Number(edge.data("weight") ?? 0), 0);
  const action = node.data("kind") === "doc"
    ? `<button class="toc-action" type="button" onclick="window.__openGraphDoc('${escapeHtml(node.id())}')">Open document</button>`
    : "";
  return `
    <div class="toc-detail">
      <p class="toc-title">Selected</p>
      <strong>${escapeHtml(node.data("label"))}</strong>
      <span>${escapeHtml(node.data("section") ?? node.data("hint") ?? node.id())}</span>
      <div class="toc-stat"><strong>${connectedEdges.length}</strong><span>relationships</span></div>
      <div class="toc-stat"><strong>${weightedDegree.toFixed(1)}</strong><span>weighted degree</span></div>
      <div class="toc-stat"><strong>${references}</strong><span>references</span></div>
      <div class="toc-stat"><strong>${companions}</strong><span>companions</span></div>
      <div class="toc-stat"><strong>${pathLinks}</strong><span>path links</span></div>
      ${action}
    </div>
  `;
}

function couplingSummary(graph) {
  const degreeByNode = new Map(graph.nodes.map((node) => [node.id, 0]));
  for (const edge of graph.edges) {
    degreeByNode.set(edge.source, (degreeByNode.get(edge.source) ?? 0) + 1);
    degreeByNode.set(edge.target, (degreeByNode.get(edge.target) ?? 0) + 1);
  }
  const degrees = [...degreeByNode.values()];
  const maxDegree = Math.max(0, ...degrees);
  return {
    maxDegree,
    highCouplingNodes: degrees.filter((degree) => degree >= 18).length
  };
}

function selectedEdgeDetails(edge) {
  const source = edge.source().data("label");
  const target = edge.target().data("label");
  return `
    <div class="toc-detail">
      <p class="toc-title">Relationship</p>
      <strong>${escapeHtml(edge.data("label"))}</strong>
      <span>${escapeHtml(source)} -> ${escapeHtml(target)}</span>
    </div>
  `;
}

window.__openGraphDoc = (source) => loadDoc(source);

function showGraphError(error) {
  const content = document.querySelector("#content");
  if (content) {
    content.className = "content graph-content";
    content.innerHTML = `<h1>Unable to load concept map</h1><pre>${escapeHtml(error.stack ?? error.message)}</pre>`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(markdown, doc) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let table = [];
  let code = null;
  let blockquote = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "), doc)}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    html.push(`<${list.type}>${list.items.map((item) => `<li>${renderInline(item, doc)}</li>`).join("")}</${list.type}>`);
    list = null;
  };

  const flushTable = () => {
    if (table.length < 2) {
      table = [];
      return;
    }
    const [head, , ...rows] = table;
    const cells = (row, tag) => row.split("|").slice(1, -1).map((cell) => `<${tag}>${renderInline(cell.trim(), doc)}</${tag}>`).join("");
    html.push(`<table><thead><tr>${cells(head, "th")}</tr></thead><tbody>${rows.map((row) => `<tr>${cells(row, "td")}</tr>`).join("")}</tbody></table>`);
    table = [];
  };

  const flushQuote = () => {
    if (!blockquote.length) return;
    html.push(`<blockquote>${blockquote.map((line) => `<p>${renderInline(line, doc)}</p>`).join("")}</blockquote>`);
    blockquote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
    flushQuote();
  };

  for (const line of lines) {
    const fence = line.match(/^```(.*)$/);
    if (fence) {
      if (code) {
        html.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
        code = null;
      } else {
        flushAll();
        code = { lang: fence[1], lines: [] };
      }
      continue;
    }

    if (code) {
      code.lines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushAll();
      continue;
    }

    if (/^\|.+\|$/.test(line)) {
      flushParagraph();
      flushList();
      flushQuote();
      table.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2], doc)}</h${level}>`);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      flushList();
      flushTable();
      blockquote.push(quote[1]);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      flushTable();
      flushQuote();
      const type = unordered ? "ul" : "ol";
      if (!list || list.type !== type) flushList();
      list ??= { type, items: [] };
      list.items.push((unordered ?? ordered)[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushAll();
  if (code) html.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
  return html.join("\n");
}

function renderInline(value, doc) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => renderLink(label, href, doc));
  return text;
}

function renderLink(label, href, doc) {
  const resolved = normalizeRelativeDoc(doc.source, href);
  const target = state.manifest.find((item) => item.source === resolved);
  if (target) {
    return `<a href="#doc=${encodeURIComponent(target.source)}" data-doc-link="${escapeHtml(target.source)}">${label}</a>`;
  }
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${label}</a>`;
}

async function boot() {
  const manifest = await fetch("/docs-manifest.json").then((response) => response.json());
  state.manifest = manifest.docs;
  state.graph = manifest.graph ?? { nodes: [], edges: [] };
  renderShell();
  const source = getHashDoc();
  await loadDoc(source && state.manifest.some((doc) => doc.source === source) ? source : "START_HERE.md");
}

boot().catch((error) => {
  app.innerHTML = `<main class="error"><h1>Unable to load docs</h1><pre>${escapeHtml(error.stack ?? error.message)}</pre></main>`;
});
