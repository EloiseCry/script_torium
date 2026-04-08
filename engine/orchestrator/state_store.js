import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findProjectRoot(startPath = __dirname) {
  let current = path.resolve(startPath);

  while (true) {
    if (fs.existsSync(path.join(current, "package.json"))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return path.resolve(startPath);
}

export const PROJECT_ROOT = findProjectRoot(__dirname);
export const STATE_PATH = path.join(PROJECT_ROOT, "runtime", "orchestrator", "state.json");
export const STATE_SEED_PATH = path.join(PROJECT_ROOT, "engine", "orchestrator", "state.seed.json");
export const DECISION_PATH = path.join(PROJECT_ROOT, "engine", "orchestrator", "decision_table.json");

function ensureStateSeed() {
  if (!fs.existsSync(STATE_SEED_PATH)) {
    throw new Error(`No existe state.seed.json: ${STATE_SEED_PATH}`);
  }
}

export function ensureRuntimeState() {
  ensureStateSeed();
  if (fs.existsSync(STATE_PATH)) return STATE_PATH;

  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.copyFileSync(STATE_SEED_PATH, STATE_PATH);
  return STATE_PATH;
}

export function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function loadState() {
  const runtimeStatePath = ensureRuntimeState();
  return loadJson(runtimeStatePath);
}

export function saveState(state) {
  saveJson(STATE_PATH, state);
}
