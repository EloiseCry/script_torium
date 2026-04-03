import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const MEDIA_REF_PATTERN = /"((?:assets|audio|pipelines\/capcut_pack)\/[^"]+)"/g;

function parseCliArgs(argv) {
  const args = {
    outputJson: path.join(repoRoot, "runtime", "outputs", "pipeline_media_coverage.json"),
    outputMarkdown: path.join(repoRoot, "docs", "COBERTURA_MEDIA_PIPELINES.md")
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
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

function walkArcFiles(rootDir) {
  const found = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (entry.name.endsWith(".arc")) found.push(absolute);
    }
  }

  walk(rootDir);
  return found.sort();
}

function collectRefs(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const refs = new Set();
  MEDIA_REF_PATTERN.lastIndex = 0;
  let match;
  while ((match = MEDIA_REF_PATTERN.exec(content)) !== null) refs.add(match[1]);
  return [...refs].sort();
}

function buildCoverage() {
  const pipelinesRoot = path.join(repoRoot, "pipelines");
  const files = walkArcFiles(pipelinesRoot);

  const items = files.map(filePath => {
    const relative = path.relative(repoRoot, filePath).replace(/\\/g, "/");
    const refs = collectRefs(filePath);
    const present = refs.filter(ref => fs.existsSync(path.join(repoRoot, ref)));
    const missing = refs.filter(ref => !fs.existsSync(path.join(repoRoot, ref)));
    const coverage = refs.length ? Number(((present.length / refs.length) * 100).toFixed(2)) : 100;

    return {
      file: relative,
      refsTotal: refs.length,
      refsPresent: present.length,
      refsMissing: missing.length,
      coverage,
      present,
      missing
    };
  });

  const summary = {
    totalArcFiles: items.length,
    fullyCovered: items.filter(item => item.refsMissing === 0).length,
    partiallyCovered: items.filter(item => item.refsPresent > 0 && item.refsMissing > 0).length,
    uncovered: items.filter(item => item.refsPresent === 0 && item.refsMissing > 0).length
  };

  return {
    generatedAt: new Date().toISOString(),
    summary,
    items
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Cobertura de Media por Pipeline");
  lines.push("");
  lines.push("## Resumen");
  lines.push("");
  lines.push(`- Archivos .arc auditados: ${report.summary.totalArcFiles}`);
  lines.push(`- Cobertura total: ${report.summary.fullyCovered}`);
  lines.push(`- Cobertura parcial: ${report.summary.partiallyCovered}`);
  lines.push(`- Sin media disponible: ${report.summary.uncovered}`);
  lines.push("");
  lines.push("## Estado por archivo");
  lines.push("");

  for (const item of report.items) {
    lines.push(`- \`${item.file}\` -> ${item.refsPresent}/${item.refsTotal} (${item.coverage}%)`);
  }

  lines.push("");
  lines.push("## Pipelines totalmente cubiertos");
  lines.push("");
  for (const item of report.items.filter(entry => entry.refsMissing === 0)) {
    lines.push(`- \`${item.file}\``);
  }

  lines.push("");
  lines.push("## Pipelines parciales");
  lines.push("");
  for (const item of report.items.filter(entry => entry.refsPresent > 0 && entry.refsMissing > 0)) {
    lines.push(`- \`${item.file}\``);
    lines.push(`  faltan: ${item.missing.join(", ")}`);
  }

  lines.push("");
  lines.push("## Pipelines sin media resuelta");
  lines.push("");
  for (const item of report.items.filter(entry => entry.refsPresent === 0 && entry.refsMissing > 0)) {
    lines.push(`- \`${item.file}\``);
  }

  return `${lines.join("\n")}\n`;
}

const cli = parseCliArgs(process.argv.slice(2));
const report = buildCoverage();

fs.mkdirSync(path.dirname(cli.outputJson), { recursive: true });
fs.writeFileSync(cli.outputJson, JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(cli.outputMarkdown, renderMarkdown(report), "utf8");

console.log(JSON.stringify({ outputJson: cli.outputJson, outputMarkdown: cli.outputMarkdown, summary: report.summary }, null, 2));
