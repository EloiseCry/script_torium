import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runArcFile } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const inputPath = path.join(
  root,
  "pipelines",
  "reels",
  "madonna_hibrida",
  "madonna_hibrida_template.arc"
);

const outputPath = path.join(root, "runtime", "previews", "madonna_hibrida_template.preview.arc");
const reportPath = path.join(root, "runtime", "outputs", "madonna_hibrida_template.preview.report.json");

execFileSync(
  process.execPath,
  [
    "tools/materialize_placeholder_preview.mjs",
    path.relative(root, inputPath),
    "--output",
    path.relative(root, outputPath),
    "--report-json",
    path.relative(root, reportPath)
  ],
  { cwd: root, stdio: "pipe" }
);

assert.ok(fs.existsSync(outputPath));
assert.ok(fs.existsSync(reportPath));

const previewSource = fs.readFileSync(outputPath, "utf8");
assert.ok(previewSource.includes("\"assets/madonna_hibrida/01.jpg\""));
assert.ok(previewSource.includes("\"assets/madonna_hibrida/04.jpg\""));
assert.ok(
  previewSource.includes("\"runtime/previews/media/madonna_hibrida_template.audio_main.preview.wav\"")
);

const previewRun = await runArcFile(outputPath);
assert.equal(previewRun.context.media.present.length, 5);
assert.equal(previewRun.context.media.placeholder.length, 0);
assert.equal(previewRun.context.media.replacementHints.length, 0);
assert.equal(previewRun.context.media.missing.length, 0);

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
assert.equal(report.summary.replaced, 5);
assert.equal(report.summary.unresolved, 0);
assert.ok(
  report.replaced.some(
    entry =>
      entry.ref === "audio/__track.wav" &&
      entry.previewCandidate === "runtime/previews/media/madonna_hibrida_template.audio_main.preview.wav" &&
      typeof entry.generated === "boolean"
  )
);

console.log("Placeholder preview materialization OK");
