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
  "madonna_hibrida",
  "madonna_hibrida_master.arc"
);

const run = await runArcFile(masterPath);

assert.equal(run.ritual.dialect, "sequence");
assert.equal(run.duration, 90);
assert.equal(run.context.files.length, 4);

const imageClips = run.context.timeline.filter(clip => clip.clipType === "image");
const textClips = run.context.timeline.filter(clip => clip.clipType === "text");
const audioClips = run.context.timeline.filter(clip => clip.type === "audio");

assert.equal(imageClips.length, 19);
assert.equal(textClips.length, 19);
assert.equal(audioClips.length, 3);

assert.equal(textClips[0].value, "Ella no vino a ser vista.");
assert.equal(textClips[textClips.length - 1].value, "Ascensión: donde la forma sueña con su origen.");
assert.equal(audioClips[0].src, "audio/antes_del_silencio_cantos_de_ballena.wav");
assert.equal(audioClips[1].start, 30);
assert.equal(audioClips[2].start, 60);

console.log("Real pipeline Madonna OK");
