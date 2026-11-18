#!/usr/bin/env node
// Runs the Kane CLI flows in kane/flows against the app and writes results Cursor can read.
// Usage:
//   node scripts/kane-check.mjs                 all flows against http://localhost:3000
//   node scripts/kane-check.mjs --tag=smoke     only flows tagged smoke
//   node scripts/kane-check.mjs --flow=restart  only kane/flows/restart_test.md
//   node scripts/kane-check.mjs --url=https://your-app.vercel.app
//   node scripts/kane-check.mjs --headed        show the Chrome window (good for the demo video)
// Exit codes: 0 all passed, 1 at least one flow failed or timed out, 2 Kane did not start.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();
const FLOWS_DIR = path.join(ROOT, "kane", "flows");
const OUT_DIR = path.join(ROOT, ".kane");
const RUNS_DIR = path.join(OUT_DIR, "runs");
const FAILURES = path.join(OUT_DIR, "FAILURES.md");
const LAST = path.join(OUT_DIR, "last-run.json");
const HISTORY = path.join(OUT_DIR, "history.log");
const RUN_LOG = path.join(ROOT, "kane", "RUN_LOG.md"); // committed, so judges see real runs
const isWin = process.platform === "win32";

const args = process.argv.slice(2);
const getArg = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const value = m[2].replace(/^['"]|['"]$/g, "");
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}
loadDotEnv(path.join(ROOT, ".env.local"));
loadDotEnv(path.join(ROOT, ".env"));

const BASE = (getArg("url") || process.env.KANE_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const ONLY_TAG = getArg("tag");
const ONLY_FLOW = getArg("flow");
const HEADED = args.includes("--headed") || process.env.KANE_HEADED === "1";
const DESKTOP_WINDOW = process.env.KANE_DESKTOP_WINDOW || "1280x800";
const MOBILE_WINDOW = process.env.KANE_MOBILE_WINDOW || "800x1000"; // Kane's documented minimum width is 800
const STEP_TIMEOUT = process.env.KANE_STEP_TIMEOUT || "180";

const now = () => new Date().toLocaleString("en-GB", { hour12: false });
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

function kaneSync(kargs) {
  return spawnSync("kane-cli", kargs, {
    cwd: ROOT,
    shell: isWin,
    encoding: "utf8",
    env: { ...process.env, KANE_CLI_USER_AGENT: "cursor" },
  });
}

function readTags(file) {
  const text = fs.readFileSync(file, "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return [];
  const line = fm[1].split(/\r?\n/).find((l) => l.trim().startsWith("tags:"));
  if (!line) return [];
  return line.replace(/^\s*tags:\s*/, "").replace(/[\[\]]/g, "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
}

function writeOut(results, overall, note) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const summary = { finishedAt: now(), baseUrl: BASE, overall, note: note || null, results };
  fs.writeFileSync(LAST, JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "STATUS"), overall + "\n");

  let md = "";
  if (overall === "passed") {
    md = `# Kane CLI: all green\n\nRun finished ${summary.finishedAt} against ${BASE}.\n\n` +
      results.map((r) => `* ${r.flow}: passed${r.shareUrl ? ` (${r.shareUrl})` : ""}`).join("\n") + "\n";
  } else if (overall === "not_started") {
    md = `# Kane CLI did not start\n\nRun at ${summary.finishedAt} against ${BASE}.\n\nReason: ${note}\n\n` +
      "This is NOT an app bug. Do not edit app code or flows because of it. Report it to Mohak with the fix.\n";
  } else {
    md = `# Kane CLI failures\n\nRun finished ${summary.finishedAt} against ${BASE}.\n` +
      "Fix the APP so these flows pass. Do not edit kane/flows to make them pass unless the flow text is truly wrong, and say so if you do.\n\n";
    for (const r of results) {
      if (r.status === "passed") { md += `## ${r.flow}: passed\n\n`; continue; }
      md += `## ${r.flow}: ${r.status.toUpperCase()} (exit ${r.exitCode})\n\n`;
      md += `Flow file: ${r.file}\n\n`;
      if (r.failedSteps.length) md += "Failed steps (Kane remarks):\n" + r.failedSteps.map((s) => `* step ${s.step}: ${s.remark}`).join("\n") + "\n\n";
      if (r.reasons.length) md += "Kane run_end reasons:\n" + r.reasons.map((s) => `* ${s}`).join("\n") + "\n\n";
      if (r.errors.length) md += "Kane errors:\n" + r.errors.map((s) => `* ${s}`).join("\n") + "\n\n";
      if (r.resultMdFailed) md += "From Result.md:\n\n```\n" + r.resultMdFailed + "\n```\n\n";
      md += `Raw NDJSON: ${r.ndjson}\nProgress log: ${r.log}\n\n`;
    }
  }
  fs.writeFileSync(FAILURES, md);

  const line = `${summary.finishedAt} | ${BASE} | ${overall} | ` +
    results.map((r) => `${r.flow}:${r.status}`).join(", ") + (note ? ` | ${note}` : "") + "\n";
  fs.appendFileSync(HISTORY, line);
  if (!fs.existsSync(RUN_LOG)) {
    fs.mkdirSync(path.dirname(RUN_LOG), { recursive: true });
    fs.writeFileSync(RUN_LOG, "# Kane CLI run log\n\nWritten automatically by scripts/kane-check.mjs after every run.\n\n| When (local time) | Target | Result | Flows |\n|---|---|---|---|\n");
  }
  fs.appendFileSync(RUN_LOG, `| ${summary.finishedAt} | ${BASE} | ${overall} | ${results.map((r) => `${r.flow} ${r.status}`).join("; ") || note} |\n`);
}

function parseRun(flowFile, stdoutText, exitCode) {
  const events = stdoutText.split(/\r?\n/).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const done = [...events].reverse().find((e) => e.type === "test_md_done");
  const failedSteps = events.filter((e) => !e.type && e.status === "failed").map((e) => ({ step: e.step, remark: e.remark || "" }));
  const reasons = events.filter((e) => e.type === "run_end" && e.status && e.status !== "passed")
    .map((e) => [e.one_liner, e.reason, e.summary].filter(Boolean).join(" | "));
  const errors = events.filter((e) => e.type === "error").map((e) => e.message || JSON.stringify(e));
  const stem = path.basename(flowFile).replace(/_test\.md$/, "");
  const resultMd = path.join(path.dirname(flowFile), `output-${stem}`, "Result.md");
  let resultMdFailed = "";
  if (exitCode !== 0 && fs.existsSync(resultMd)) {
    resultMdFailed = fs.readFileSync(resultMd, "utf8").split(/^## /m).slice(1).filter((s) => /✗|failed/i.test(s.split("\n")[0])).map((s) => "## " + s.trim()).join("\n\n").slice(0, 4000);
  }
  let status = "not_started";
  if (exitCode === 0) status = "passed";
  else if (exitCode === 1) status = "failed";
  else if (exitCode === 3) status = "timeout";
  return { status, overall: done?.overall_status || null, shareUrl: done?.share_url || null, failedSteps, reasons, errors, resultMdFailed };
}

function runFlow(flowFile) {
  return new Promise((resolve) => {
    const stem = path.basename(flowFile).replace(/_test\.md$/, "");
    const ndjson = path.join(RUNS_DIR, `${stem}.ndjson`);
    const log = path.join(RUNS_DIR, `${stem}.log`);
    const kargs = ["testmd", "run", rel(flowFile), "--agent", "--url", `${BASE}/?fresh=1`, "--timeout", STEP_TIMEOUT];
    if (!HEADED) kargs.push("--headless");
    if (process.env.LT_USERNAME && process.env.LT_ACCESS_KEY) {
      kargs.push("--username", process.env.LT_USERNAME, "--access-key", process.env.LT_ACCESS_KEY);
    }
    console.error(`\n[kane] ${now()} running ${rel(flowFile)} against ${BASE}`);
    const child = spawn("kane-cli", kargs, {
      cwd: ROOT,
      shell: isWin,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, KANE_CLI_USER_AGENT: "cursor" },
    });
    let out = "";
    const logStream = fs.createWriteStream(log);
    child.stdout.on("data", (d) => { out += d.toString(); });
    child.stderr.on("data", (d) => { process.stderr.write(d); logStream.write(d); });
    child.on("error", (err) => { logStream.end(); resolve({ exitCode: 2, out, spawnError: String(err), ndjson, log }); });
    child.on("close", (code) => { logStream.end(); fs.writeFileSync(ndjson, out); resolve({ exitCode: code ?? 2, out, ndjson, log }); });
  });
}

async function main() {
  fs.mkdirSync(RUNS_DIR, { recursive: true });

  if (!fs.existsSync(FLOWS_DIR)) { writeOut([], "not_started", "kane/flows folder is missing"); process.exit(2); }
  let flows = fs.readdirSync(FLOWS_DIR).filter((f) => f.endsWith("_test.md")).map((f) => path.join(FLOWS_DIR, f));
  if (ONLY_FLOW) flows = flows.filter((f) => path.basename(f).replace(/_test\.md$/, "") === ONLY_FLOW);
  if (ONLY_TAG) flows = flows.filter((f) => readTags(f).includes(ONLY_TAG.toLowerCase()));
  const isMobile = (f) => /mobile/i.test(path.basename(f)) || readTags(f).includes("mobile");
  flows.sort((a, b) => Number(isMobile(a)) - Number(isMobile(b)) || a.localeCompare(b));
  if (!flows.length) { writeOut([], "not_started", "no matching *_test.md flows in kane/flows"); process.exit(2); }

  const version = kaneSync(["--version"]);
  if (version.status !== 0) {
    writeOut([], "not_started", "kane-cli is not installed or not on PATH. Run: npm install -g @testmuai/kane-cli");
    process.exit(2);
  }

  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(10000) });
    if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    writeOut([], "not_started", `App is not reachable at ${BASE} (${err.message}). Start it with: npm run dev`);
    process.exit(2);
  }

  const results = [];
  for (const flow of flows) {
    const mobile = isMobile(flow);
    if (mobile) kaneSync(["config", "set-window", MOBILE_WINDOW]);
    let run;
    try { run = await runFlow(flow); }
    finally { if (mobile) kaneSync(["config", "set-window", DESKTOP_WINDOW]); }
    const parsed = parseRun(flow, run.out, run.exitCode);
    if (run.spawnError) parsed.errors.push(run.spawnError);
    results.push({ flow: path.basename(flow).replace(/_test\.md$/, ""), file: rel(flow), exitCode: run.exitCode, ndjson: rel(run.ndjson), log: rel(run.log), ...parsed });
    console.error(`[kane] ${path.basename(flow)}: ${parsed.status}`);
  }

  const anyFailed = results.some((r) => r.status === "failed" || r.status === "timeout");
  const anyNotStarted = results.some((r) => r.status === "not_started");
  const overall = anyFailed ? "failed" : anyNotStarted ? "not_started" : "passed";
  const note = !anyFailed && anyNotStarted ? "Kane exited 2 on at least one flow (sign in, credits, Chrome or config). See .kane/runs/*.log" : null;
  writeOut(results, overall, note);
  console.error(`\n[kane] overall: ${overall}. Details in .kane/FAILURES.md`);
  process.exit(overall === "passed" ? 0 : overall === "failed" ? 1 : 2);
}

main().catch((err) => { writeOut([], "not_started", `runner crashed: ${err.message}`); process.exit(2); });
