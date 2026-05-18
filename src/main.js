const app = document.querySelector("#app");

const state = {
  manifest: [],
  graph: { nodes: [], edges: [] },
  active: null,
  search: "",
  lang: "all",
  path: "all",
  view: "doc",
  headings: []
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
    if (state.view === "map") renderConceptMap();
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      renderNav();
      if (state.view === "map") renderConceptMap();
    });
  });

  document.querySelectorAll("[data-path]").forEach((button) => {
    button.addEventListener("click", () => {
      state.path = button.dataset.path;
      if (state.path === "zh") state.lang = "zh-CN";
      renderNav();
      if (state.view === "map") renderConceptMap();
    });
  });

  document.querySelector("#sidebar-toggle").addEventListener("click", () => {
    document.body.classList.toggle("nav-collapsed");
  });

  document.querySelector("#map-toggle").addEventListener("click", () => {
    if (state.view === "map") {
      loadDoc(state.active?.source ?? "START_HERE.md");
    } else {
      renderConceptMap();
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
        <h2>${escapeHtml(section)}</h2>
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

function renderConceptMap() {
  state.view = "map";
  renderNav();

  const content = document.querySelector("#content");
  const graph = visibleGraph();
  const layout = layoutGraph(graph.nodes);
  const width = 1180;
  const height = layout.height;

  document.querySelector("#doc-title").textContent = "Concept Map";
  document.querySelector("#doc-path").textContent = `${activePathLabel()} relationship graph`;
  document.querySelector("#map-toggle").textContent = "Reading view";
  document.querySelector("#source-link").hidden = true;

  content.className = "content graph-content";
  content.innerHTML = `
    <section class="graph-intro">
      <div>
        <p class="eyebrow">Concept Map</p>
        <h1>Document Relationship Graph</h1>
      </div>
      <p>${graph.docCount} visible docs, ${graph.edges.length} visible relationships. Filter by reading path, language, or search to reduce the map.</p>
    </section>
    <div class="graph-legend" aria-label="Relationship legend">
      <span><i class="legend-dot path"></i>Path organizes doc</span>
      <span><i class="legend-dot companion"></i>Bilingual companion</span>
      <span><i class="legend-dot references"></i>Markdown reference</span>
    </div>
    <div class="graph-scroll">
      <svg class="concept-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Documentation concept map">
        <g class="graph-edges">
          ${graph.edges.map((edge) => renderEdge(edge, layout.positions)).join("")}
        </g>
        <g class="graph-nodes">
          ${graph.nodes.map((node) => renderNode(node, layout.positions.get(node.id))).join("")}
        </g>
      </svg>
    </div>
  `;

  content.querySelectorAll("[data-source]").forEach((node) => {
    node.addEventListener("click", () => loadDoc(node.dataset.source));
  });

  content.querySelectorAll("[data-graph-path]").forEach((node) => {
    node.addEventListener("click", () => {
      state.path = node.dataset.graphPath;
      if (state.path === "zh") state.lang = "zh-CN";
      renderNav();
      renderConceptMap();
    });
  });

  renderGraphToc(graph);
  content.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function visibleGraph() {
  const docs = filteredDocs();
  const docIds = new Set(docs.map((doc) => doc.source));
  const pathIds = new Set();

  for (const doc of docs) {
    for (const path of doc.paths ?? []) {
      if (path !== "zh") pathIds.add(`path:${path}`);
    }
  }

  const visibleIds = new Set([...docIds, ...pathIds]);
  const nodes = state.graph.nodes.filter((node) => visibleIds.has(node.id));
  const edges = state.graph.edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));

  return { nodes, edges, docCount: docs.length };
}

function layoutGraph(nodes) {
  const positions = new Map();
  const width = 1180;
  const margin = 80;
  const pathNodes = nodes.filter((node) => node.kind === "path");
  const docNodes = nodes.filter((node) => node.kind === "doc");
  const sectionGroups = groupDocs(docNodes);
  const sections = Object.entries(sectionGroups);
  const pathGap = Math.max(82, 520 / Math.max(1, pathNodes.length));

  pathNodes.forEach((node, index) => {
    positions.set(node.id, { x: 126, y: 118 + index * pathGap });
  });

  let maxY = 0;
  sections.forEach(([section, docs], sectionIndex) => {
    const x = 330 + (sectionIndex % 3) * 275;
    const rowOffset = Math.floor(sectionIndex / 3) * 380;
    positions.set(`section:${section}`, { x, y: 84 + rowOffset });
    docs.forEach((node, index) => {
      const y = 134 + rowOffset + index * 76;
      positions.set(node.id, { x, y });
      maxY = Math.max(maxY, y);
    });
  });

  return { positions, height: Math.max(720, maxY + margin), width };
}

function renderEdge(edge, positions) {
  const source = positions.get(edge.source);
  const target = positions.get(edge.target);
  if (!source || !target) return "";
  return `<line class="graph-edge ${escapeHtml(edge.type)}" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" />`;
}

function renderNode(node, position) {
  if (!position) return "";
  const label = truncateLabel(node.label, node.kind === "path" ? 18 : 30);
  if (node.kind === "path") {
    const pathId = node.id.replace(/^path:/, "");
    return `
      <g class="graph-node path-node" transform="translate(${position.x} ${position.y})" data-graph-path="${escapeHtml(pathId)}" tabindex="0" role="button">
        <rect x="-78" y="-26" width="156" height="52" rx="8"></rect>
        <text y="-2">${escapeHtml(label)}</text>
        <text class="node-subtitle" y="15">${escapeHtml(node.hint ?? "")}</text>
      </g>
    `;
  }
  return `
    <g class="graph-node doc-node ${node.lang === "zh-CN" ? "zh-node" : ""}" transform="translate(${position.x} ${position.y})" data-source="${escapeHtml(node.id)}" tabindex="0" role="button">
      <rect x="-112" y="-28" width="224" height="56" rx="8"></rect>
      <text y="-4">${escapeHtml(label)}</text>
      <text class="node-subtitle" y="15">${escapeHtml(node.section)}</text>
    </g>
  `;
}

function truncateLabel(value, limit) {
  const text = String(value ?? "");
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function renderGraphToc(graph) {
  const toc = document.querySelector("#toc");
  const byKind = graph.edges.reduce((counts, edge) => {
    counts[edge.type] = (counts[edge.type] ?? 0) + 1;
    return counts;
  }, {});
  toc.innerHTML = `
    <p class="toc-title">Graph</p>
    <div class="toc-stat"><strong>${graph.nodes.length}</strong><span>nodes</span></div>
    <div class="toc-stat"><strong>${graph.edges.length}</strong><span>edges</span></div>
    <div class="toc-stat"><strong>${byKind.path ?? 0}</strong><span>path links</span></div>
    <div class="toc-stat"><strong>${byKind.companion ?? 0}</strong><span>bilingual links</span></div>
    <div class="toc-stat"><strong>${byKind.references ?? 0}</strong><span>doc links</span></div>
  `;
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
