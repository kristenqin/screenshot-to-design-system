const app = document.querySelector("#app");

const state = {
  manifest: [],
  graph: { nodes: [], edges: [] },
  cytoscape: null,
  graphInstance: null,
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

async function renderConceptMap() {
  state.view = "map";
  renderNav();

  const content = document.querySelector("#content");
  const graph = visibleGraph();

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
      <p>${graph.docCount} visible docs, ${graph.edges.length} visible relationships. Drag nodes, zoom the canvas, or select a node to inspect its neighborhood.</p>
    </section>
    <div class="graph-legend" aria-label="Relationship legend">
      <span><i class="legend-dot path"></i>Path organizes doc</span>
      <span><i class="legend-dot companion"></i>Bilingual companion</span>
      <span><i class="legend-dot references"></i>Markdown reference</span>
    </div>
    <div class="graph-stage">
      <div id="concept-map" class="concept-map" role="img" aria-label="Interactive documentation concept map"></div>
    </div>
  `;

  renderGraphToc(graph);
  await mountCytoscapeGraph(graph);
  content.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function loadCytoscape() {
  if (!state.cytoscape) {
    const module = await import("/vendor/cytoscape.esm.min.mjs?v=cytoscape");
    state.cytoscape = module.default;
  }
  return state.cytoscape;
}

async function mountCytoscapeGraph(graph) {
  const cytoscape = await loadCytoscape();
  const container = document.querySelector("#concept-map");
  if (!container) return;
  if (state.graphInstance) {
    state.graphInstance.destroy();
    state.graphInstance = null;
  }

  const elements = [
    ...graph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        kind: node.kind,
        lang: node.lang,
        section: node.section,
        hint: node.hint,
        paths: node.paths ?? []
      },
      classes: `${node.kind} ${node.lang === "zh-CN" ? "zh" : ""}`
    })),
    ...graph.edges.map((edge, index) => ({
      data: {
        id: `edge:${index}:${edge.source}:${edge.target}:${edge.type}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.label
      },
      classes: edge.type
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
      padding: 48,
      nodeRepulsion: 7600,
      idealEdgeLength: (edge) => edge.data("type") === "references" ? 150 : 105,
      edgeElasticity: (edge) => edge.data("type") === "references" ? 0.42 : 0.62,
      nestingFactor: 1.15,
      gravity: 0.34,
      numIter: 1400
    }
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

function graphStyles() {
  return [
    {
      selector: "node",
      style: {
        "background-color": "#ffffff",
        "border-color": "#c8d3df",
        "border-width": 1,
        "color": "#17202a",
        "font-size": 11,
        "font-weight": 700,
        "height": 42,
        "label": "data(label)",
        "line-height": 1.2,
        "shape": "round-rectangle",
        "text-halign": "center",
        "text-max-width": 112,
        "text-valign": "center",
        "text-wrap": "wrap",
        "width": 128
      }
    },
    {
      selector: "node.path",
      style: {
        "background-color": "#e6f2fb",
        "border-color": "#1769aa",
        "color": "#0f4f82",
        "height": 46,
        "shape": "round-rectangle",
        "width": 104
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
        "font-size": 9,
        "label": "data(label)",
        "line-color": "#9aacbf",
        "opacity": 0.72,
        "target-arrow-color": "#9aacbf",
        "target-arrow-shape": "triangle",
        "text-background-color": "#fbfcfd",
        "text-background-opacity": 0.82,
        "text-background-padding": 2,
        "text-rotation": "autorotate",
        "width": 1.5
      }
    },
    {
      selector: "edge.path",
      style: {
        "label": "",
        "line-color": "#1769aa",
        "target-arrow-color": "#1769aa",
        "width": 1.25,
        "opacity": 0.36
      }
    },
    {
      selector: "edge.companion",
      style: {
        "line-color": "#9a6a2f",
        "line-style": "dashed",
        "target-arrow-color": "#9a6a2f",
        "width": 2
      }
    },
    {
      selector: "edge.references",
      style: {
        "line-color": "#65727e",
        "target-arrow-color": "#65727e",
        "width": 2.2
      }
    },
    {
      selector: ".faded",
      style: {
        "opacity": 0.12,
        "text-opacity": 0.05
      }
    },
    {
      selector: ".neighborhood",
      style: {
        "opacity": 1,
        "text-opacity": 1
      }
    },
    {
      selector: "node.selected",
      style: {
        "border-color": "#0f4f82",
        "border-width": 3,
        "background-color": "#d8ebf8"
      }
    },
    {
      selector: "edge.selected",
      style: {
        "opacity": 1,
        "width": 3.2
      }
    }
  ];
}

function focusGraphNode(cy, node) {
  const neighborhood = node.closedNeighborhood();
  cy.elements().addClass("faded").removeClass("selected neighborhood");
  neighborhood.removeClass("faded").addClass("neighborhood");
  node.addClass("selected");
  neighborhood.edges().addClass("selected");
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

function renderGraphToc(graph, selectedNode = null, selectedEdge = null) {
  const toc = document.querySelector("#toc");
  const byKind = graph.edges.reduce((counts, edge) => {
    counts[edge.type] = (counts[edge.type] ?? 0) + 1;
    return counts;
  }, {});
  const selected = selectedNode ? selectedNodeDetails(selectedNode) : selectedEdge ? selectedEdgeDetails(selectedEdge) : "";
  toc.innerHTML = `
    <p class="toc-title">Graph</p>
    <div class="toc-stat"><strong>${graph.nodes.length}</strong><span>nodes</span></div>
    <div class="toc-stat"><strong>${graph.edges.length}</strong><span>edges</span></div>
    <div class="toc-stat"><strong>${byKind.path ?? 0}</strong><span>path links</span></div>
    <div class="toc-stat"><strong>${byKind.companion ?? 0}</strong><span>bilingual links</span></div>
    <div class="toc-stat"><strong>${byKind.references ?? 0}</strong><span>doc links</span></div>
    ${selected}
  `;
}

function selectedNodeDetails(node) {
  const connectedEdges = node.connectedEdges();
  const references = connectedEdges.filter((edge) => edge.data("type") === "references").length;
  const companions = connectedEdges.filter((edge) => edge.data("type") === "companion").length;
  const pathLinks = connectedEdges.filter((edge) => edge.data("type") === "path").length;
  const action = node.data("kind") === "doc"
    ? `<button class="toc-action" type="button" onclick="window.__openGraphDoc('${escapeHtml(node.id())}')">Open document</button>`
    : "";
  return `
    <div class="toc-detail">
      <p class="toc-title">Selected</p>
      <strong>${escapeHtml(node.data("label"))}</strong>
      <span>${escapeHtml(node.data("section") ?? node.data("hint") ?? node.id())}</span>
      <div class="toc-stat"><strong>${connectedEdges.length}</strong><span>relationships</span></div>
      <div class="toc-stat"><strong>${references}</strong><span>references</span></div>
      <div class="toc-stat"><strong>${companions}</strong><span>companions</span></div>
      <div class="toc-stat"><strong>${pathLinks}</strong><span>path links</span></div>
      ${action}
    </div>
  `;
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
