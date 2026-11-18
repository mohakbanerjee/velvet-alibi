// Cursor afterFileEdit hook: remember that app code changed, so the stop hook knows to run Kane.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();
let input = "";
process.stdin.on("data", (d) => { input += d; });
process.stdin.on("end", () => {
  try {
    const { file_path = "" } = JSON.parse(input || "{}");
    const relPath = path.relative(ROOT, file_path).split(path.sep).join("/");
    if (relPath.startsWith("src/")) {
      fs.mkdirSync(path.join(ROOT, ".kane"), { recursive: true });
      fs.appendFileSync(path.join(ROOT, ".kane", "dirty"), relPath + "\n");
    }
  } catch {
    // never break the agent because of this hook
  }
  process.stdout.write("{}\n");
});
