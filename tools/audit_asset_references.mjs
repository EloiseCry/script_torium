import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const MEDIA_REF_PATTERN = /"((?:assets|audio|pipelines\/capcut_pack)\/[^"]+)"/g;

function normalizeHostPath(inputPath) {
  if (!inputPath) return inputPath;
  if (/^\/mnt\/([a-zA-Z])\//.test(inputPath)) {
    const [, drive] = inputPath.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
    const remainder = inputPath.replace(/^\/mnt\/[a-zA-Z]\//, "").replaceAll("/", "\\");
    return `${drive.toUpperCase()}:\\${remainder}`;
  }
  return inputPath;
}

function parseCliArgs(argv) {
  const args = {
    sourceRoot: "C:\\Users\\alien\\scriptorium-arcontico punto cero",
    outputJson: path.join(repoRoot, "runtime", "outputs", "asset_audit.json"),
    outputMarkdown: path.join(repoRoot, "docs", "AUDITORIA_ASSETS.md")
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--source-root") {
      args.sourceRoot = argv[index + 1] ?? args.sourceRoot;
      index += 1;
      continue;
    }
    if (token === "--output-json") {
      args.outputJson = argv[index + 1] ?? args.outputJson;
      index += 1;
      continue;
    }
    if (token === "--output-markdown") {
      args.outputMarkdown = argv[index + 1] ?? args.outputMarkdown;
      index += 1;
    }
  }

  return args;
}

function walkFiles(rootDir, extensions) {
  const found = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (extensions.has(path.extname(entry.name).toLowerCase())) {
        found.push(absolute);
      }
    }
  }

  walk(rootDir);
  return found.sort();
}

function collectReferences(pipelinesRoot) {
  const refs = new Map();
  const files = walkFiles(pipelinesRoot, new Set([".arc", ".json", ".md"]));

  for (const filePath of files) {
    const relativeFile = path.relative(repoRoot, filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf8");
    MEDIA_REF_PATTERN.lastIndex = 0;
    let match;
    while ((match = MEDIA_REF_PATTERN.exec(content)) !== null) {
      const ref = match[1];
      if (!refs.has(ref)) refs.set(ref, new Set());
      refs.get(ref).add(relativeFile);
    }
  }

  return [...refs.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([ref, filesSet]) => ({
      ref,
      usedBy: [...filesSet].sort()
    }));
}

function categorizeRef(ref) {
  if (ref.startsWith("assets/arconte/")) return "arconte";
  if (ref.startsWith("assets/madonna/")) return "madonna";
  if (ref.startsWith("assets/madonna_hibrida/")) return "madonna_hibrida";
  if (ref.startsWith("audio/")) return "audio";
  if (ref.startsWith("pipelines/capcut_pack/")) return "capcut_pack";
  return "other";
}

function buildAudit(entries, sourceRoot) {
  const sourceBase = path.resolve(sourceRoot);
  const summary = {
    totalReferences: entries.length,
    presentInSource: 0,
    missingInSource: 0,
    presentInMaster: 0,
    missingInMaster: 0,
    categories: {}
  };

  const auditedEntries = entries.map(entry => {
    const masterPath = path.join(repoRoot, entry.ref);
    const sourcePath = path.join(sourceBase, entry.ref);
    const existsInMaster = fs.existsSync(masterPath);
    const existsInSource = fs.existsSync(sourcePath);
    const category = categorizeRef(entry.ref);

    summary.categories[category] ||= {
      total: 0,
      presentInSource: 0,
      missingInSource: 0
    };
    summary.categories[category].total += 1;

    if (existsInSource) {
      summary.presentInSource += 1;
      summary.categories[category].presentInSource += 1;
    } else {
      summary.missingInSource += 1;
      summary.categories[category].missingInSource += 1;
    }

    if (existsInMaster) summary.presentInMaster += 1;
    else summary.missingInMaster += 1;

    return {
      ...entry,
      category,
      existsInMaster,
      existsInSource
    };
  });

  return { generatedAt: new Date().toISOString(), sourceRoot: sourceBase, summary, entries: auditedEntries };
}

function renderMarkdown(audit) {
  const lines = [];
  lines.push("# Auditoria de Assets");
  lines.push("");
  lines.push("## Resumen");
  lines.push("");
  lines.push(`- Referencias unicas auditadas: ${audit.summary.totalReferences}`);
  lines.push(`- Presentes en origen tecnico: ${audit.summary.presentInSource}`);
  lines.push(`- Ausentes en origen tecnico: ${audit.summary.missingInSource}`);
  lines.push(`- Presentes en maestro: ${audit.summary.presentInMaster}`);
  lines.push(`- Ausentes en maestro: ${audit.summary.missingInMaster}`);
  lines.push("");
  lines.push("## Por categoria");
  lines.push("");

  for (const [category, data] of Object.entries(audit.summary.categories).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- ${category}: ${data.presentInSource}/${data.total} presentes en origen`);
  }

  lines.push("");
  lines.push("## Referencias ausentes en origen");
  lines.push("");

  const missing = audit.entries.filter(entry => !entry.existsInSource);
  for (const entry of missing) {
    lines.push(`- \`${entry.ref}\``);
    lines.push(`  usado por: ${entry.usedBy.join(", ")}`);
  }

  lines.push("");
  lines.push("## Referencias presentes en origen");
  lines.push("");

  const present = audit.entries.filter(entry => entry.existsInSource);
  for (const entry of present) {
    lines.push(`- \`${entry.ref}\``);
    lines.push(`  usado por: ${entry.usedBy.join(", ")}`);
  }

  return `${lines.join("\n")}\n`;
}

const cli = parseCliArgs(process.argv.slice(2));
const references = collectReferences(path.join(repoRoot, "pipelines"));
const audit = buildAudit(references, normalizeHostPath(cli.sourceRoot));

fs.mkdirSync(path.dirname(cli.outputJson), { recursive: true });
fs.writeFileSync(cli.outputJson, JSON.stringify(audit, null, 2), "utf8");
fs.writeFileSync(cli.outputMarkdown, renderMarkdown(audit), "utf8");

console.log(
  JSON.stringify(
    {
      outputJson: cli.outputJson,
      outputMarkdown: cli.outputMarkdown,
      summary: audit.summary
    },
    null,
    2
  )
);
