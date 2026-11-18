// Demo helper. Plants (or removes) one real, honest bug so the demo can show Kane fail, Cursor fix, Kane pass.
// npm run demo:plant-bug   -> notebook gets wiped every time you change rooms
// npm run demo:unplant-bug -> emergency reset only. In the demo, let Cursor fix it from the Kane failure.
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "src", "game", "reducer.ts");
const GOOD = "notebook: state.notebook, // keep notebook across rooms";
const BAD = "notebook: [],";
const mode = process.argv[2];
let src = fs.readFileSync(FILE, "utf8");

if (mode === "plant") {
  if (!src.includes(GOOD)) { console.error("Could not find the healthy line. Is the bug already planted?"); process.exit(1); }
  src = src.replace(GOOD, BAD);
  fs.writeFileSync(FILE, src);
  console.log("Bug planted in src/game/reducer.ts (GO_TO_ROOM). Commit it, then trigger Kane.");
} else if (mode === "unplant") {
  // Only touch the planted line inside the GO_TO_ROOM case (initialState also has "notebook: [],").
  const re = /(case "GO_TO_ROOM":[\s\S]*?)notebook: \[\],/;
  if (!re.test(src)) { console.error("No planted bug found."); process.exit(1); }
  src = src.replace(re, (_, head) => head + GOOD);
  fs.writeFileSync(FILE, src);
  console.log("Bug removed.");
} else {
  console.log(src.includes(GOOD) ? "healthy" : "bug is planted");
}
