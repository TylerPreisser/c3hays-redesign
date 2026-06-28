// Minimal zero-dependency static server for the Next.js `out/` static export.
// Handles trailingSlash routing (/about -> out/about/index.html) and serves
// out/404.html with a real 404 status for unknown paths — faithful to production
// (GitHub Pages / Cloudflare Pages) without the flaky Turbopack dev server.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = join(process.cwd(), "out");
const PORT = Number(process.env.PORT || 4321);

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain", ".webmanifest": "application/manifest+json",
};

async function tryFiles(pathname) {
  const candidates = [];
  const clean = pathname.replace(/\/+$/, "");
  if (extname(pathname)) candidates.push(join(ROOT, pathname));
  else {
    candidates.push(join(ROOT, clean, "index.html"));
    candidates.push(join(ROOT, clean + ".html"));
    if (pathname === "/") candidates.push(join(ROOT, "index.html"));
  }
  for (const f of candidates) {
    try { const s = await stat(f); if (s.isFile()) return f; } catch {}
  }
  return null;
}

// Never let a transient error take the audit server down mid-run.
process.on("uncaughtException", (e) => console.error("server uncaught:", e.message));
process.on("unhandledRejection", (e) => console.error("server unhandled:", e?.message || e));

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let file = await tryFiles(decodeURIComponent(url.pathname));
  let status = 200;
  if (!file) {
    status = 404;
    file = (await tryFiles("/404")) || join(ROOT, "404.html");
  }
  try {
    const body = await readFile(file);
    res.writeHead(status, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`serving out/ at http://localhost:${PORT}`));
