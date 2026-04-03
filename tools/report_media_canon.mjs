import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadMediaCatalog, summarizeMediaCatalog } from "../engine/media/catalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function parseCliArgs(argv) {
  const args = {
    outputJson: path.join(repoRoot, "runtime", "outputs", "media_canon_report.json"),
    outputMarkdown: path.join(repoRoot, "docs", "MANIFIESTO_MEDIA_CANONICA.md")
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

function renderMarkdown(catalog, summary) {
  const lines = [];
  lines.push("# Manifiesto de Media Canonica");
  lines.push("");
  lines.push("## Resumen");
  lines.push("");
  lines.push(`- Entradas catalogadas: ${summary.totalEntries}`);
  lines.push(`- evidence_hydrated: ${summary.states.evidence_hydrated ?? 0}`);
  lines.push(`- placeholder_missing: ${summary.states.placeholder_missing ?? 0}`);
  lines.push(`- declared_missing_final: ${summary.states.declared_missing_final ?? 0}`);
  lines.push("");
  lines.push("## Regla Operativa");
  lines.push("");
  lines.push("- `evidence_hydrated`: media usable hoy en el repo maestro.");
  lines.push("- `placeholder_missing`: media placeholder permitida para plantillas, pero no cuenta como cobertura real.");
  lines.push("- `declared_missing_final`: media final esperada, documentada, pero todavía no recuperada.");
  lines.push("");
  lines.push("## Por Familia");
  lines.push("");

  for (const [family, data] of Object.entries(summary.families).sort((a, b) => a[0].localeCompare(b[0]))) {
    const states = Object.entries(data.byState)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([state, count]) => `${state}: ${count}`)
      .join(", ");
    lines.push(`- ${family}: ${data.total} (${states})`);
  }

  for (const state of ["evidence_hydrated", "placeholder_missing", "declared_missing_final"]) {
    lines.push("");
    lines.push(`## ${state}`);
    lines.push("");
    for (const entry of catalog.entries.filter(item => item.state === state)) {
      lines.push(`- \`${entry.ref}\``);
      lines.push(`  familia: ${entry.family}`);
      lines.push(`  rol: ${entry.role}`);
      lines.push(`  evidencia: ${entry.evidence}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

const cli = parseCliArgs(process.argv.slice(2));
const catalog = loadMediaCatalog(repoRoot);
const summary = summarizeMediaCatalog(repoRoot);
const report = {
  generatedAt: new Date().toISOString(),
  manifestPath: catalog.manifestPath,
  version: catalog.version,
  summary,
  entries: catalog.entries
};

fs.mkdirSync(path.dirname(cli.outputJson), { recursive: true });
fs.writeFileSync(cli.outputJson, JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(cli.outputMarkdown, renderMarkdown(catalog, summary), "utf8");

console.log(JSON.stringify({ outputJson: cli.outputJson, outputMarkdown: cli.outputMarkdown, summary }, null, 2));
