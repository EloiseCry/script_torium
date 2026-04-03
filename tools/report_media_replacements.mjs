import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReplacementCatalog } from "../engine/media/replacements.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function parseCliArgs(argv) {
  const args = {
    outputJson: path.join(repoRoot, "runtime", "outputs", "media_replacements_report.json"),
    outputMarkdown: path.join(repoRoot, "docs", "MANIFIESTO_REEMPLAZO_PLACEHOLDERS.md")
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

function buildReport(catalog) {
  const sets = catalog.sets.map(set => {
    const placeholders = (set.placeholders || []).map(placeholder => {
      const previewCandidate = placeholder.preview_candidate ?? null;
      const previewCandidateExists =
        typeof previewCandidate === "string" &&
        fs.existsSync(path.join(repoRoot, previewCandidate));

      return {
        ref: placeholder.ref,
        slot: placeholder.slot,
        kind: placeholder.kind,
        replacementRole: placeholder.replacement_role ?? null,
        acceptedPatterns: placeholder.accepted_patterns ?? [],
        previewCandidate,
        previewCandidateExists
      };
    });

    return {
      id: set.id,
      family: set.family,
      pipeline: set.pipeline,
      notes: set.notes ?? "",
      placeholders,
      summary: {
        total: placeholders.length,
        withPreviewCandidate: placeholders.filter(item => item.previewCandidate).length,
        withExistingPreviewCandidate: placeholders.filter(item => item.previewCandidateExists).length
      }
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    manifestPath: catalog.manifestPath,
    version: catalog.version,
    summary: {
      totalSets: sets.length,
      totalPlaceholders: sets.reduce((acc, set) => acc + set.summary.total, 0),
      placeholdersWithPreviewCandidate: sets.reduce((acc, set) => acc + set.summary.withPreviewCandidate, 0),
      placeholdersWithExistingPreviewCandidate: sets.reduce((acc, set) => acc + set.summary.withExistingPreviewCandidate, 0)
    },
    sets
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Manifiesto de Reemplazo de Placeholders");
  lines.push("");
  lines.push("## Resumen");
  lines.push("");
  lines.push(`- Sets declarados: ${report.summary.totalSets}`);
  lines.push(`- Placeholders declarados: ${report.summary.totalPlaceholders}`);
  lines.push(`- Con preview candidate: ${report.summary.placeholdersWithPreviewCandidate}`);
  lines.push(`- Con preview candidate existente: ${report.summary.placeholdersWithExistingPreviewCandidate}`);

  for (const set of report.sets) {
    lines.push("");
    lines.push(`## ${set.id}`);
    lines.push("");
    lines.push(`- familia: ${set.family}`);
    lines.push(`- pipeline: ${set.pipeline}`);
    if (set.notes) lines.push(`- notas: ${set.notes}`);

    for (const placeholder of set.placeholders) {
      lines.push(`- \`${placeholder.ref}\``);
      lines.push(`  slot: ${placeholder.slot}`);
      lines.push(`  tipo: ${placeholder.kind}`);
      lines.push(`  rol: ${placeholder.replacementRole ?? "n/a"}`);
      lines.push(`  patrones admitidos: ${placeholder.acceptedPatterns.join(", ") || "n/a"}`);
      lines.push(`  preview candidate: ${placeholder.previewCandidate ?? "n/a"}`);
      lines.push(`  preview candidate existe: ${placeholder.previewCandidateExists ? "si" : "no"}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

const cli = parseCliArgs(process.argv.slice(2));
const catalog = loadReplacementCatalog(repoRoot);
const report = buildReport(catalog);

fs.mkdirSync(path.dirname(cli.outputJson), { recursive: true });
fs.writeFileSync(cli.outputJson, JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(cli.outputMarkdown, renderMarkdown(report), "utf8");

console.log(JSON.stringify({ outputJson: cli.outputJson, outputMarkdown: cli.outputMarkdown, summary: report.summary }, null, 2));
