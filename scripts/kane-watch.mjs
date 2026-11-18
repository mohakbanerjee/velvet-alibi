// Save watcher: every time a file under src/ is saved, run the Kane smoke flows. Use --all for every flow.
import chokidar from "chokidar";
import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";

const ROOT = process.cwd();
const all = process.argv.includes("--all");
const headed = process.argv.includes("--headed");
let timer = null;
let running = false;
let queued = false;

function runKane() {
  if (running) { queued = true; return; }
  running = true;
  const args = [path.join(ROOT, "scripts", "kane-check.mjs")];
  if (!all) args.push("--tag=smoke");
  if (headed) args.push("--headed");
  console.log(`\n[kane:watch] change detected, running Kane ${all ? "(all flows)" : "(smoke flows)"}...`);
  const child = spawn(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
  child.on("close", (code) => {
    running = false;
    const label = code === 0 ? "PASSED" : code === 1 ? "FAILED, see .kane/FAILURES.md" : "DID NOT START, see .kane/FAILURES.md";
    console.log(`[kane:watch] ${label}`);
    if (code === 1) console.log(fs.readFileSync(path.join(ROOT, ".kane", "FAILURES.md"), "utf8").slice(0, 1500));
    if (queued) { queued = false; runKane(); }
  });
}

chokidar.watch(path.join(ROOT, "src"), { ignoreInitial: true }).on("all", () => {
  clearTimeout(timer);
  timer = setTimeout(runKane, 3000);
});
console.log("[kane:watch] watching src/ for saves. Ctrl+C to stop.");
