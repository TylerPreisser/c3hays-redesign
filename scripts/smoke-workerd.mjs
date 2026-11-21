#!/usr/bin/env node
// Run the BUILT Worker under workerd and refuse a build that would 500.
//
// Why this exists: Next 16.4 reads `.next/server/preview-props.json` while it builds its server, and an OpenNext
// older than 1.20.12 does not bundle that file, so EVERY route of the built Worker throws
// `Unexpected loadManifest(/.next/server/preview-props.json) call!`. `cf:build` and `wrangler deploy --dry-run`
// only bundle the code; nothing had ever executed it. This does, locally, before any staging rollout:
//
//   `wrangler dev --env <env> --local` boots the Worker in workerd; `/`, `/news` and `/locations/hays` must answer 200
//   with real HTML, and workerd must log no uncaught error. No remote call is made, state lives in a temp dir.
//
// Usage: CMS_LIVE=1 npm run cf:build, then  node scripts/smoke-workerd.mjs [--env staging] [--port 4642] [--dir <built tree>]
// Exit 0 = every check passed. Exit 1 = a check failed (each failure is printed).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const ENV = opt("env", "staging");
const PORT = Number(opt("port", "4642"));
const REPO = resolve(opt("dir", fileURLToPath(new URL("..", import.meta.url))));
const WRANGLER = join(REPO, "node_modules", ".bin", "wrangler");
const MUST_200 = ["/", "/news", "/locations/hays"];
const BOOT_MS = 180_000;

const failures = [];
const fail = (msg) => { failures.push(msg); console.log(`FAIL ${msg}`); };
const ok = (msg) => console.log(`ok   ${msg}`);

if (!existsSync(join(REPO, ".open-next", "worker.js"))) {
  console.log("FAIL no .open-next/worker.js: run `CMS_LIVE=1 npm run cf:build` first");
  process.exit(1);
}

const TMP = mkdtempSync(join(tmpdir(), "c3site-smoke-workerd-"));
let child = null;
const stopChild = () => {
  if (child && child.exitCode === null && child.signalCode === null) {
    try { process.kill(-child.pid, "SIGTERM"); } catch {} // its own process group, never a pattern kill
  }
};
process.on("exit", () => { stopChild(); rmSync(TMP, { recursive: true, force: true }); });
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(130));
const CHILD_ENV = { ...process.env, CI: "1", WRANGLER_LOG_PATH: join(TMP, "wrangler-logs") };

async function boot() {
  const log = [];
  child = spawn(WRANGLER, ["dev", "--env", ENV, "--local", "--port", String(PORT), "--ip", "127.0.0.1", "--persist-to", join(TMP, "state"), "--show-interactive-dev-session=false"], {
    cwd: REPO, detached: true, stdio: ["ignore", "pipe", "pipe"], env: CHILD_ENV,
  });
  const onData = (b) => log.push(b.toString());
  child.stdout.on("data", onData);
  child.stderr.on("data", onData);
  const started = Date.now();
  const text = () => log.join("").replace(/\x1b\[[0-9;]*m/g, "");
  while (!/Ready on http/.test(text())) {
    if (child.exitCode !== null) throw new Error(`wrangler dev exited ${child.exitCode}\n${text().slice(-3000)}`);
    // wrangler dev stays alive after a build error, waiting for a file change: fail now, not at the timeout.
    const err = text().match(/\[ERROR\][^\n]*/);
    if (err) throw new Error(`wrangler dev: ${err[0]}`);
    if (Date.now() - started > BOOT_MS) throw new Error(`wrangler dev not ready after ${BOOT_MS} ms\n${text().slice(-3000)}`);
    await new Promise((r) => setTimeout(r, 250));
  }
  return log;
}
async function stop() {
  if (!child) return;
  const c = child;
  stopChild();
  const t0 = Date.now();
  while (c.exitCode === null && c.signalCode === null && Date.now() - t0 < 10_000) await new Promise((r) => setTimeout(r, 100));
  try { process.kill(-c.pid, "SIGKILL"); } catch {}
  child = null;
}
const firstLine = (s) => s.split("\n").slice(0, 3).join(" | ").slice(0, 300);

try {
  const log = await boot();
  for (const path of MUST_200) {
    const res = await fetch(`http://127.0.0.1:${PORT}${path}`, { redirect: "follow" } /* trailingSlash: /news answers 308 to /news/ */);
    const body = await res.text();
    if (res.status === 200 && /<html/i.test(body) && /<h1|<main/i.test(body)) ok(`${path} -> 200 (${body.length} bytes of HTML)`);
    else fail(`${path} -> ${res.status}: ${firstLine(body)}`);
  }
  await new Promise((r) => setTimeout(r, 500));
  const errs = log.join("").split("\n").filter((l) => /\[wrangler:error\]|Uncaught|Unexpected loadManifest/.test(l));
  if (errs.length) fail(`workerd logged ${errs.length} error line(s), first: ${errs[0].slice(0, 300)}`);
  else ok("workerd logged no error");
} catch (err) {
  fail(String(err.message || err));
}
await stop();

if (failures.length) {
  console.log(`smoke-workerd: ${failures.length} check(s) FAILED`);
  process.exit(1);
}
console.log("smoke-workerd: all checks passed");
