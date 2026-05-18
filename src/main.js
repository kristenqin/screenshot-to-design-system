const app = document.querySelector("#app");

const state = {
  manifest: [],
  active: null,
  search: "",
  lang: "all",
  headings: []
};

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
    const haystack = `${doc.title} ${doc.summary} ${doc.source} ${doc.section}`.toLowerCase();
    return matchesLang && (!query || haystack.includes(query));
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
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      renderNav();
    });
  });

  document.querySelector("#sidebar-toggle").addEventListener("click", () => {
    document.body.classList.toggle("nav-collapsed");
  });
}

function segmentButton(value, label) {
  const active = state.lang === value ? "active" : "";
  return `<button class="segment ${active}" type="button" data-lang="${value}">${label}</button>`;
}

function renderNav() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });

  const nav = document.querySelector(".nav");
  const docs = filteredDocs();
  const groups = groupDocs(docs);

  nav.innerHTML = Object.entries(groups)
    .map(([section, sectionDocs]) => `
      <section class="nav-section">
        <h2>${escapeHtml(section)}</h2>
        ${sectionDocs.map((doc) => `
          <button class="nav-item ${state.active?.source === doc.source ? "active" : ""}" type="button" data-source="${escapeHtml(doc.source)}">
            <span>${escapeHtml(doc.title)}</span>
            <small>${escapeHtml(doc.source)}</small>
          </button>
        `).join("")}
      </section>
    `)
    .join("");

  nav.querySelectorAll("[data-source]").forEach((button) => {
    button.addEventListener("click", () => loadDoc(button.dataset.source));
  });
}

async function loadDoc(source) {
  const doc = state.manifest.find((item) => item.source === source) ?? state.manifest[0];
  if (!doc) return;
  state.active = doc;
  setHashDoc(doc.source);
  renderNav();

  const markdown = await fetch(doc.contentPath).then((response) => {
    if (!response.ok) throw new Error(`Unable to load ${doc.contentPath}`);
    return response.text();
  });

  const content = document.querySelector("#content");
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
  document.querySelector("#doc-title").textContent = doc.title;
  document.querySelector("#doc-path").textContent = doc.source;
  const sourceLink = document.querySelector("#source-link");
  sourceLink.href = doc.source;
  sourceLink.textContent = "Open source";
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
  renderShell();
  const source = getHashDoc();
  await loadDoc(source && state.manifest.some((doc) => doc.source === source) ? source : "START_HERE.md");
}

boot().catch((error) => {
  app.innerHTML = `<main class="error"><h1>Unable to load docs</h1><pre>${escapeHtml(error.stack ?? error.message)}</pre></main>`;
});
