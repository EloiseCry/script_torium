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
  "madonna_hibrida.arc"
);

const run = await runArcFile(filePath);

assert.equal(run.ritual.dialect, "timeline");
assert.equal(run.duration, 30);

const imageClips = run.context.timeline.filter(clip => clip.clipType === "image");
const textClips = run.context.timeline.filter(clip => clip.clipType === "text");
const audioClips = run.context.timeline.filter(clip => clip.type === "audio");

assert.equal(imageClips.length, 8);
assert.equal(textClips.length, 8);
assert.equal(audioClips.length, 2);

assert.equal(imageClips[0].src, "assets/madonna/frame_01.jpg");
assert.equal(textClips[0].value, "Lo humano… no terminó.");
assert.equal(textClips[textClips.length - 1].value, "REFLEJOS HÍBRIDOS\\nNuevo capítulo");
assert.equal(audioClips[0].src, "audio/vo_madonna_hibrida.wav");
assert.equal(audioClips[1].src, "audio/score_madonna_hibrida.wav");

console.log("Real pipeline Madonna Track OK");
