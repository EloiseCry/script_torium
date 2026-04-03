import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function normalizeHostPath(inputPath) {
  if (!inputPath) return inputPath;
  if (/^\/mnt\/([a-zA-Z])\//.test(inputPath)) {
    const remainder = inputPath.replace(/^\/mnt\/([a-zA-Z])\//, "");
    const drive = inputPath.match(/^\/mnt\/([a-zA-Z])\//)[1].toUpperCase();
    return `${drive}:\\${remainder.replaceAll("/", "\\")}`;
  }
  return inputPath;
}

function parseCliArgs(argv) {
  const args = {
    manifest: path.join(repoRoot, "assets", "source", "hidratacion_inicial.json"),
    dryRun: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--manifest") {
      args.manifest = argv[index + 1] ?? args.manifest;
      index += 1;
      continue;
    }

    if (token === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

function readManifest(manifestPath) {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(raw);
  return {
    sourceRoot: normalizeHostPath(manifest.source_root),
    entries: Array.isArray(manifest.entries) ? manifest.entries : []
  };
}

function copyFile(fromPath, toPath, dryRun) {
  const sourceExists = fs.existsSync(fromPath);
  const targetExists = fs.existsSync(toPath);

  if (!sourceExists) {
    return {
      source: fromPath,
      target: toPath,
      status: "missing_source"
    };
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.copyFileSync(fromPath, toPath);
  }

  return {
    source: fromPath,
    target: toPath,
    status: targetExists ? "updated" : "copied",
    bytes: fs.statSync(fromPath).size
  };
}

const cli = parseCliArgs(process.argv.slice(2));
const manifest = readManifest(cli.manifest);

const results = manifest.entries.map(entry => {
  const source = path.join(manifest.sourceRoot, entry.source);
  const target = path.join(repoRoot, entry.target);
  return {
    ref: entry.target,
    reason: entry.reason ?? "",
    ...copyFile(source, target, cli.dryRun)
  };
});

const summary = results.reduce(
  (acc, item) => {
    acc.total += 1;
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  },
  { total: 0 }
);

console.log(JSON.stringify({ manifest: cli.manifest, dryRun: cli.dryRun, summary, results }, null, 2));
