import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReplacementCatalog } from "../engine/media/replacements.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function parseCliArgs(argv) {
  const args = {
    input: null,
    output: null,
    reportJson: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!args.input && !token.startsWith("--")) {
      args.input = token;
      continue;
    }

    if (token === "--output") {
      args.output = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === "--report-json") {
      args.reportJson = argv[index + 1] ?? null;
      index += 1;
    }
  }

  return args;
}

function replaceAllQuotedRefs(source, fromRef, toRef) {
  return source.replaceAll(`"${fromRef}"`, `"${toRef}"`);
}

function buildDefaultOutputPaths(inputPath) {
  const parsed = path.parse(inputPath);
  const output = path.join(repoRoot, "runtime", "previews", `${parsed.name}.preview${parsed.ext}`);
  const reportJson = path.join(repoRoot, "runtime", "outputs", `${parsed.name}.preview.report.json`);
  return { output, reportJson };
}

const cli = parseCliArgs(process.argv.slice(2));

if (!cli.input) {
  console.error("Uso: node tools/materialize_placeholder_preview.mjs <archivo.arc> [--output path] [--report-json path]");
  process.exit(1);
}

const absoluteInput = path.resolve(repoRoot, cli.input);
const defaults = buildDefaultOutputPaths(absoluteInput);
const outputPath = cli.output ? path.resolve(repoRoot, cli.output) : defaults.output;
const reportPath = cli.reportJson ? path.resolve(repoRoot, cli.reportJson) : defaults.reportJson;

const source = fs.readFileSync(absoluteInput, "utf8");
const catalog = loadReplacementCatalog(repoRoot);
const placeholders = [];

for (const set of catalog.sets) {
  for (const placeholder of set.placeholders || []) {
    if (source.includes(`"${placeholder.ref}"`)) {
      const previewCandidate = placeholder.preview_candidate ?? null;
      const previewCandidateExists =
        typeof previewCandidate === "string" &&
        fs.existsSync(path.join(repoRoot, previewCandidate));

      placeholders.push({
        setId: set.id,
        pipeline: set.pipeline,
        ref: placeholder.ref,
        slot: placeholder.slot,
        kind: placeholder.kind,
        previewCandidate,
        previewCandidateExists
      });
    }
  }
}

let previewSource = source;
const replaced = [];
const unresolved = [];

for (const placeholder of placeholders) {
  if (placeholder.previewCandidate && placeholder.previewCandidateExists) {
    previewSource = replaceAllQuotedRefs(previewSource, placeholder.ref, placeholder.previewCandidate);
    replaced.push(placeholder);
  } else {
    unresolved.push(placeholder);
  }
}

const header = [
  "# PREVIEW MATERIALIZADO DESDE PLACEHOLDERS",
  `# source: ${path.relative(repoRoot, absoluteInput).replace(/\\/g, "/")}`,
  `# replaced: ${replaced.length}`,
  `# unresolved: ${unresolved.length}`,
  ""
].join("\n");

const finalSource = `${header}${previewSource}`;
const report = {
  generatedAt: new Date().toISOString(),
  input: absoluteInput,
  output: outputPath,
  replaced: replaced.map(item => ({
    ref: item.ref,
    slot: item.slot,
    previewCandidate: item.previewCandidate
  })),
  unresolved: unresolved.map(item => ({
    ref: item.ref,
    slot: item.slot,
    previewCandidate: item.previewCandidate ?? null
  })),
  summary: {
    placeholdersDetected: placeholders.length,
    replaced: replaced.length,
    unresolved: unresolved.length
  }
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(outputPath, finalSource, "utf8");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log(JSON.stringify({ output: outputPath, reportJson: reportPath, summary: report.summary }, null, 2));
