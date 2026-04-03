import fs from "node:fs";
import path from "node:path";

const MANIFEST_RELATIVE_PATH = path.join("assets", "source", "media_canon.json");
const cache = new Map();

export function findProjectRoot(startPath = process.cwd()) {
  let current = path.resolve(startPath);

  while (true) {
    if (fs.existsSync(path.join(current, "package.json"))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return path.resolve(startPath);
}

function loadManifest(projectRoot) {
  const manifestPath = path.join(projectRoot, MANIFEST_RELATIVE_PATH);
  const stat = fs.statSync(manifestPath);
  const cacheKey = `${manifestPath}:${stat.mtimeMs}`;

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const raw = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const entries = Array.isArray(raw.entries) ? raw.entries : [];
  const byRef = new Map(entries.map(entry => [entry.ref, entry]));
  const value = {
    manifestPath,
    version: raw.version ?? 1,
    states: raw.states ?? {},
    entries,
    byRef
  };

  cache.clear();
  cache.set(cacheKey, value);
  return value;
}

export function loadMediaCatalog(projectRoot = findProjectRoot(process.cwd())) {
  return loadManifest(projectRoot);
}

export function getMediaCatalogEntry(ref, projectRoot = findProjectRoot(process.cwd())) {
  return loadManifest(projectRoot).byRef.get(ref) ?? null;
}

export function summarizeMediaCatalog(projectRoot = findProjectRoot(process.cwd())) {
  const catalog = loadManifest(projectRoot);
  const summary = {
    totalEntries: catalog.entries.length,
    states: {},
    families: {}
  };

  for (const entry of catalog.entries) {
    summary.states[entry.state] ||= 0;
    summary.states[entry.state] += 1;

    summary.families[entry.family] ||= {
      total: 0,
      byState: {}
    };
    summary.families[entry.family].total += 1;
    summary.families[entry.family].byState[entry.state] ||= 0;
    summary.families[entry.family].byState[entry.state] += 1;
  }

  return summary;
}
