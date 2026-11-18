// Cursor stop hook: when the agent finishes a turn that edited src/, run Kane CLI.
// If Kane fails, hand the failure back to the agent as an automatic follow up message.
// Only active when .kane/hook-on exists (npm run kane:hook:on). Its content is the tag to run: "smoke" or "all".
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();
const KANE = path.join(ROOT, ".kane");
const reply = (obj) => { process.stdout.write(JSON.stringify(obj) + "\n"); process.exit(0); };

let input = "";
process.stdin.on("data", (d) => { input += d; });
process.stdin.on("end", () => {
  let payload = {};
  try { payload = JSON.parse(input || "{}"); } catch { /* ignore */ }
  const { status = "completed", loop_count = 0 } = payload;

  const hookOn = path.join(KANE, "hook-on");
  const dirty = path.join(KANE, "dirty");
  if (status !== "completed" || !fs.existsSync(hookOn) || !fs.existsSync(dirty)) reply({});

  const changed = fs.readFileSync(dirty, "utf8").split(/\r?\n/).filter(Boolean);
  fs.rmSync(dirty, { force: true });
  const tag = (fs.readFileSync(hookOn, "utf8").trim() || "smoke").toLowerCase();

  const args = [path.join(ROOT, "scripts", "kane-check.mjs")];
  if (tag !== "all") args.push(`--tag=${tag}`);
  if (fs.existsSync(path.join(KANE, "headed"))) args.push("--headed");
  const run = spawnSync(process.execPath, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024, env: process.env });
  fs.appendFileSync(path.join(KANE, "hook.log"), `${new Date().toLocaleString("en-GB")} stop hook ran kane (${tag}) after edits to ${[...new Set(changed)].join(", ")} -> exit ${run.status}\n`);

  if (run.status === 1 && loop_count < 3) {
    reply({
      followup_message:
        "Kane CLI just ran the browser flows after your last edit and at least one FAILED. " +
        "Read .kane/FAILURES.md now (and the Result.md it points to). Find the root cause in the app code under src/, fix it, " +
        "and do not edit kane/flows or weaken a check to make it pass. Explain the bug in one sentence, then stop. " +
        "The stop hook will run Kane again automatically.",
    });
  }
  if (run.status === 2 && loop_count === 0) {
    reply({
      followup_message:
        "Kane CLI could not start after your last edit (this is not an app bug). Read .kane/FAILURES.md, " +
        "do not change app code or flows because of it, and tell Mohak exactly what to fix (for example start npm run dev, run kane-cli login, or check credits). Then stop.",
    });
  }
  reply({});
});
