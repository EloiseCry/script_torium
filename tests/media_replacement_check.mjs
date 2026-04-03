import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runArcFile } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const templatePath = path.join(
  root,
  "pipelines",
  "reels",
  "madonna_hibrida",
  "madonna_hibrida_template.arc"
);

const run = await runArcFile(templatePath);

assert.equal(run.context.media.placeholder.length, 5);
assert.equal(run.context.media.replacementHints.length, 5);

const visual1 = run.context.media.replacementHints.find(entry => entry.slot === "visual_1");
assert.ok(visual1);
assert.equal(visual1.previewCandidate, "assets/madonna_hibrida/01.jpg");
assert.equal(visual1.previewCandidateExists, true);

const audioMain = run.context.media.replacementHints.find(entry => entry.slot === "audio_main");
assert.ok(audioMain);
assert.equal(audioMain.previewCandidate, null);
assert.equal(audioMain.previewCandidateExists, false);

assert.ok(
  run.context.logs.some(
    entry =>
      entry.type === "warning" &&
      entry.text === "Media faltante: assets/madonna_hibrida/__01.jpg [placeholder_missing slot=visual_1]"
  )
);

console.log("Media replacement OK");
