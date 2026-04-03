import fs from "node:fs";
import path from "node:path";
import { findProjectRoot } from "./catalog.js";

const MANIFEST_RELATIVE_PATH = path.join("assets", "source", "media_replacements.json");
const cache = new Map();

function loadManifest(projectRoot) {
  const manifestPath = path.join(projectRoot, MANIFEST_RELATIVE_PATH);
  const stat = fs.statSync(manifestPath);
  const cacheKey = `${manifestPath}:${stat.mtimeMs}`;

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const raw = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const sets = Array.isArray(raw.placeholder_sets) ? raw.placeholder_sets : [];
  const byRef = new Map();

  for (const set of sets) {
    for (const placeholder of set.placeholders || []) {
      byRef.set(placeholder.ref, {
        setId: set.id,
        family: set.family,
        pipeline: set.pipeline,
        notes: set.notes ?? "",
        ...placeholder
      });
    }
  }

  const value = {
    manifestPath,
    version: raw.version ?? 1,
    sets,
    byRef
  };

  cache.clear();
  cache.set(cacheKey, value);
  return value;
}

export function loadReplacementCatalog(projectRoot = findProjectRoot(process.cwd())) {
  return loadManifest(projectRoot);
}

export function getReplacementHint(ref, projectRoot = findProjectRoot(process.cwd())) {
  const entry = loadManifest(projectRoot).byRef.get(ref);
  if (!entry) return null;

  const previewCandidate = entry.preview_candidate ?? null;
  const previewCandidateExists =
    typeof previewCandidate === "string" &&
    fs.existsSync(path.join(projectRoot, previewCandidate));

  return {
    ref,
    setId: entry.setId,
    family: entry.family,
    pipeline: entry.pipeline,
    slot: entry.slot,
    kind: entry.kind,
    acceptedPatterns: entry.accepted_patterns ?? [],
    previewCandidate,
    previewCandidateExists,
    replacementRole: entry.replacement_role ?? null,
    notes: entry.notes ?? ""
  };
}
