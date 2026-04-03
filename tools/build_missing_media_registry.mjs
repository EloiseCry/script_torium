import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function parseCliArgs(argv) {
  const args = {
    auditJson: path.join(repoRoot, "runtime", "outputs", "asset_audit.json"),
    sourceTextsDir: "C:\\Users\\alien\\scriptorium-arcontico punto cero",
    outputJson: path.join(repoRoot, "runtime", "outputs", "missing_media_registry.json"),
    outputMarkdown: path.join(repoRoot, "docs", "REGISTRO_MEDIA_FALTANTE.md")
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--audit-json") {
      args.auditJson = argv[index + 1] ?? args.auditJson;
      index += 1;
      continue;
    }
    if (token === "--source-texts-dir") {
      args.sourceTextsDir = argv[index + 1] ?? args.sourceTextsDir;
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

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadTextCorpus(sourceTextsDir) {
  const files = ["1.txt", "2.txt", "3.txt", "4.txt", "5.txt", "6.txt"]
    .map(name => path.join(sourceTextsDir, name))
    .filter(filePath => fs.existsSync(filePath));

  return files.map(filePath => ({
    filePath,
    content: fs.readFileSync(filePath, "utf8")
  }));
}

function collectMentions(ref, corpus) {
  const mentions = [];
  for (const file of corpus) {
    const lines = file.content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (line.includes(ref)) {
        mentions.push({
          file: path.basename(file.filePath),
          line: index + 1,
          snippet: line.trim().slice(0, 220)
        });
      }
    });
  }
  return mentions;
}

function classifyMissingRef(ref, mentions) {
  if (mentions.length > 0) return "declared_only_in_text_corpus";
  return "no_material_evidence";
}

function buildRegistry(audit, corpus) {
  const unresolved = audit.entries.filter(entry => !fs.existsSync(path.join(repoRoot, entry.ref)));

  const items = unresolved.map(entry => {
    const mentions = collectMentions(entry.ref, corpus);
    return {
      ref: entry.ref,
      category: entry.category,
      usedBy: entry.usedBy,
      mentionCount: mentions.length,
      mentions: mentions.slice(0, 12),
      status: classifyMissingRef(entry.ref, mentions)
    };
  });

  const summary = {
    totalMissingInMaster: items.length,
    declaredOnlyInTextCorpus: items.filter(item => item.status === "declared_only_in_text_corpus").length,
    noMaterialEvidence: items.filter(item => item.status === "no_material_evidence").length
  };

  return {
    generatedAt: new Date().toISOString(),
    summary,
    items
  };
}

function renderMarkdown(registry) {
  const lines = [];
  lines.push("# Registro de Media Faltante");
  lines.push("");
  lines.push("## Resumen");
  lines.push("");
  lines.push(`- Referencias faltantes en maestro: ${registry.summary.totalMissingInMaster}`);
  lines.push(`- Declaradas en corpus textual 1-6: ${registry.summary.declaredOnlyInTextCorpus}`);
  lines.push(`- Sin evidencia material ni textual adicional: ${registry.summary.noMaterialEvidence}`);
  lines.push("");
  lines.push("## Declaradas Solo En Corpus Textual");
  lines.push("");

  for (const item of registry.items.filter(entry => entry.status === "declared_only_in_text_corpus")) {
    lines.push(`- \`${item.ref}\``);
    lines.push(`  usado por: ${item.usedBy.join(", ")}`);
    if (item.mentions[0]) {
      const first = item.mentions[0];
      lines.push(`  primera mención: ${first.file}:${first.line} -> ${first.snippet}`);
    }
  }

  lines.push("");
  lines.push("## Sin Evidencia Adicional");
  lines.push("");

  for (const item of registry.items.filter(entry => entry.status === "no_material_evidence")) {
    lines.push(`- \`${item.ref}\``);
    lines.push(`  usado por: ${item.usedBy.join(", ")}`);
  }

  return `${lines.join("\n")}\n`;
}

const cli = parseCliArgs(process.argv.slice(2));
const audit = loadJson(cli.auditJson);
const corpus = loadTextCorpus(cli.sourceTextsDir);
const registry = buildRegistry(audit, corpus);

fs.mkdirSync(path.dirname(cli.outputJson), { recursive: true });
fs.writeFileSync(cli.outputJson, JSON.stringify(registry, null, 2), "utf8");
fs.writeFileSync(cli.outputMarkdown, renderMarkdown(registry), "utf8");

console.log(JSON.stringify({ outputJson: cli.outputJson, outputMarkdown: cli.outputMarkdown, summary: registry.summary }, null, 2));
