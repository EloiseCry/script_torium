import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runArcFile } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const coveredPath = path.join(
  root,
  "pipelines",
  "reels",
  "kerigma_silencio_arconte",
  "reel_template.arc"
);

const uncoveredPath = path.join(
  root,
  "pipelines",
  "reels",
  "madonna_hibrida",
  "madonna_hibrida.arc"
);

const coveredRun = await runArcFile(coveredPath);
assert.equal(coveredRun.context.media.missing.length, 0);
assert.equal(coveredRun.context.media.present.length, 4);
assert.equal(coveredRun.context.media.hydrated.length, 4);

const uncoveredRun = await runArcFile(uncoveredPath);
assert.equal(uncoveredRun.context.media.present.length, 0);
assert.equal(uncoveredRun.context.media.missing.length, 10);
assert.equal(uncoveredRun.context.media.declaredMissing.length, 10);
assert.ok(
  uncoveredRun.context.logs.some(
    entry =>
      entry.type === "warning" &&
      entry.text.startsWith("Media faltante:") &&
      entry.text.includes("[declared_missing_final]")
  )
);

console.log("Media validation OK");
