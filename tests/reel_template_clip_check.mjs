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
  "kerigma_silencio_arconte",
  "reel_template.arc"
);

const run = await runArcFile(filePath);

assert.equal(run.ritual.dialect, "timeline");
assert.equal(run.duration, 30);

const imageClips = run.context.timeline.filter(clip => clip.clipType === "image");
const textClips = run.context.timeline.filter(clip => clip.clipType === "text");
const audioClips = run.context.timeline.filter(clip => clip.type === "audio");

assert.equal(imageClips.length, 3);
assert.equal(textClips.length, 3);
assert.equal(audioClips.length, 1);

assert.equal(textClips[0].value, "Apertura del eco.");
assert.equal(textClips[2].start, 8);
assert.equal(audioClips[0].src, "audio/silencio_arconte.wav");

console.log("Reel template clip OK");
