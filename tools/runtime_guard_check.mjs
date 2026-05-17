import { execSync } from "node:child_process";

const allowed = new Set([
  "runtime/cache/.gitkeep",
  "runtime/outputs/.gitkeep",
  "runtime/temp/.gitkeep",
  "runtime/previews/.gitkeep",
  "runtime/orchestrator/.gitkeep",
  "runtime/knowledge/.gitkeep"
]);

let stdout = "";
try {
  stdout = execSync("git ls-files runtime", { encoding: "utf8" });
} catch {
  stdout = "";
}

const tracked = stdout
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean)
  .sort();

const unexpected = tracked.filter(file => !allowed.has(file));

if (unexpected.length > 0) {
  console.error("Runtime guard failed. Files tracked in runtime/ outside allowlist:");
  for (const file of unexpected) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Runtime guard OK");
