import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded === "/" ? "/index.html" : decoded;
  const local = normalize(relative).replace(/^(\.\.[/\\])+/, "");
  return join(root, local);
}

async function readStatic(pathname) {
  const direct = safePath(pathname);
  try {
    const info = await stat(direct);
    if (info.isFile()) return { path: direct, body: await readFile(direct) };
  } catch {}

  const publicPath = join(root, "public", pathname.replace(/^\//, ""));
  try {
    const info = await stat(publicPath);
    if (info.isFile()) return { path: publicPath, body: await readFile(publicPath) };
  } catch {}

  return { path: join(root, "index.html"), body: await readFile(join(root, "index.html")) };
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
    const file = await readStatic(url.pathname);
    const type = mimeTypes[extname(file.path)] ?? "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(file.body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error?.stack ?? String(error));
  }
});

server.listen(port, host, () => {
  console.log(`Docs site running at http://${host}:${port}`);
});
