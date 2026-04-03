import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runArcFile } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const packFiles = [
  "pipelines/capcut_pack/madonna_hibrida_pack/assets/01.jpg",
  "pipelines/capcut_pack/madonna_hibrida_pack/assets/02.jpg",
  "pipelines/capcut_pack/madonna_hibrida_pack/assets/03.jpg",
  "pipelines/capcut_pack/madonna_hibrida_pack/assets/04.jpg",
  "pipelines/capcut_pack/madonna_hibrida_pack/audio/silencio_arconte.wav"
];

for (const relativePath of packFiles) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `${relativePath} no existe`);
  assert.ok(fs.statSync(absolutePath).size > 0, `${relativePath} está vacío`);
}

const acto5Path = path.join(root, "pipelines", "reels", "kerigma_master", "acto5.arc");
const run = await runArcFile(acto5Path);

assert.equal(run.context.media.missing.length, 0);
assert.equal(run.context.media.present.length, 0);
assert.equal(run.context.timeline.length, 3);

console.log("CapCut pack hydration OK");
