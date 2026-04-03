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

const finalReelPath = path.join(
  root,
  "pipelines",
  "reels",
  "madonna_hibrida",
  "madonna_hibrida.arc"
);

const hydratedPath = path.join(
  root,
  "pipelines",
  "reels",
  "madonna_hibrida",
  "madonna_hibrida_acto2.arc"
);

const templateRun = await runArcFile(templatePath);
assert.equal(templateRun.context.media.placeholder.length, 5);
assert.equal(templateRun.context.media.declaredMissing.length, 0);
assert.equal(templateRun.context.media.missing.length, 5);
assert.equal(templateRun.context.media.replacementHints.length, 5);

const finalReelRun = await runArcFile(finalReelPath);
assert.equal(finalReelRun.context.media.declaredMissing.length, 10);
assert.equal(finalReelRun.context.media.placeholder.length, 0);
assert.equal(finalReelRun.context.media.replacementHints.length, 0);
assert.ok(
  finalReelRun.context.logs.some(
    entry =>
      entry.type === "warning" &&
      entry.text.includes("[declared_missing_final]")
  )
);

const hydratedRun = await runArcFile(hydratedPath);
assert.equal(hydratedRun.context.media.hydrated.length, 4);
assert.equal(hydratedRun.context.media.declaredMissing.length, 1);
assert.equal(hydratedRun.context.media.placeholder.length, 0);

console.log("Media catalog OK");
