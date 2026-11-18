// npm run kane:hook:on | kane:hook:on:all | kane:hook:off | kane:hook:headed
import fs from "node:fs";
import path from "node:path";
const KANE = path.join(process.cwd(), ".kane");
fs.mkdirSync(KANE, { recursive: true });
const mode = process.argv[2];
if (mode === "on") fs.writeFileSync(path.join(KANE, "hook-on"), "smoke\n");
else if (mode === "all") fs.writeFileSync(path.join(KANE, "hook-on"), "all\n");
else if (mode === "headed") fs.writeFileSync(path.join(KANE, "headed"), "1\n");
else if (mode === "headless") fs.rmSync(path.join(KANE, "headed"), { force: true });
else if (mode === "off") fs.rmSync(path.join(KANE, "hook-on"), { force: true });
console.log(`Kane stop hook: ${fs.existsSync(path.join(KANE, "hook-on")) ? "ON (" + fs.readFileSync(path.join(KANE, "hook-on"), "utf8").trim() + ")" : "OFF"}, browser: ${fs.existsSync(path.join(KANE, "headed")) ? "visible" : "headless"}`);
