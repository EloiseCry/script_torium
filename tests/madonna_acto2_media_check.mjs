import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runArcFile } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const filePath = path.join(
  root,
  "pipelines",
  "reels",
  "madonna_hibrida",
  "madonna_hibrida_acto2.arc"
);

const run = await runArcFile(filePath);

assert.equal(run.context.media.present.length, 4);
assert.equal(run.context.media.missing.length, 1);
assert.equal(run.context.media.hydrated.length, 4);
assert.equal(run.context.media.declaredMissing.length, 1);
assert.ok(run.context.media.present.includes("assets/madonna_hibrida/01.jpg"));
assert.ok(run.context.media.missing.includes("audio/antes_del_silencio_cantos_de_ballena.wav"));
assert.ok(
  run.context.logs.some(
    entry =>
      entry.type === "warning" &&
      entry.text === "Media faltante: audio/antes_del_silencio_cantos_de_ballena.wav [declared_missing_final]"
  )
);

console.log("Madonna acto2 media OK");
