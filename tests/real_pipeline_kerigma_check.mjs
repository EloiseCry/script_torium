import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runArcFile } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const masterPath = path.join(
  root,
  "pipelines",
  "reels",
  "kerigma_silencio_arconte",
  "kerigma_silencio_arconte_master.arc"
);

const run = await runArcFile(masterPath);

assert.equal(run.ritual.dialect, "sequence");
assert.equal(run.duration, 150);
assert.equal(run.context.files.length, 7);

const imageClips = run.context.timeline.filter(clip => clip.clipType === "image");
const textClips = run.context.timeline.filter(clip => clip.clipType === "text");
const audioClips = run.context.timeline.filter(clip => clip.type === "audio");

assert.equal(imageClips.length, 23);
assert.equal(textClips.length, 26);
assert.equal(audioClips.length, 4);

assert.equal(textClips[0].value, "Antes del nombre, hubo un pulso.");
assert.equal(textClips[textClips.length - 1].value, "Y en ese silencio nacimos nosotros.");
assert.ok(
  run.context.logs.some(
    entry => entry.type === "warning" && entry.text === "Dialecto no soportado: unknown"
  )
);

console.log("Real pipeline Kerigma OK");
