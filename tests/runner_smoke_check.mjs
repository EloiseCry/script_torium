import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportToCapCut } from "../engine/exporters/capcut_exporter.js";
import { runArcFile, runArcSource } from "../engine/runner/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const stepRitualPath = path.join(root, "arc", "rituales", "ritual.invocacion.arc");
const stepRun = await runArcFile(stepRitualPath);
assert.equal(stepRun.ritual.dialect, "steps");
assert.ok(stepRun.context.timeline.length > 0);
assert.ok(stepRun.context.logs.some(entry => entry.type === "log"));
assert.ok(stepRun.context.invocations.length > 0);

const timelineSource = `
reel demo_runner {
  assets {
    img1 = "assets/demo/01.jpg"
    audio = "audio/demo.wav"
  }

  styles {
    font_primary = "Bodoni"
  }

  timeline {
    segment 0-3s {
      img = img1
      text = "Umbral"
    }

    segment 3-5s {
      img = img1
      text = "Cruce"
    }
  }
}
`;

const timelineRun = await runArcSource(timelineSource, {
  filePath: path.join(root, "runtime", "temp", "demo_runner.arc")
});
assert.equal(timelineRun.ritual.dialect, "timeline");
assert.ok(timelineRun.context.timeline.some(clip => clip.clipType === "image"));
assert.ok(timelineRun.context.timeline.some(clip => clip.clipType === "text"));
assert.ok(timelineRun.context.timeline.some(clip => clip.type === "audio"));

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "scriptorium-runner-"));
const actOnePath = path.join(tempDir, "acto1.arc");
const actTwoPath = path.join(tempDir, "acto2.arc");
const masterPath = path.join(tempDir, "master.arc");

fs.writeFileSync(
  actOnePath,
  `
reel acto1 {
  timeline {
    segment 0-2s {
      text = "Acto uno"
    }
  }
}
`,
  "utf8"
);

fs.writeFileSync(
  actTwoPath,
  `
reel acto2 {
  timeline {
    segment 0-4s {
      text = "Acto dos"
    }
  }
}
`,
  "utf8"
);

fs.writeFileSync(
  masterPath,
  `
kerigma master_demo {
  secuencia {
    incluye: "./acto1.arc"
    incluye: "./acto2.arc"
  }
}
`,
  "utf8"
);

const sequenceRun = await runArcFile(masterPath);
assert.equal(sequenceRun.ritual.dialect, "sequence");
assert.equal(sequenceRun.context.files.length, 3);

const textClips = sequenceRun.context.timeline.filter(clip => clip.clipType === "text");
assert.equal(textClips.length, 2);
assert.equal(textClips[0].value, "Acto uno");
assert.equal(textClips[1].value, "Acto dos");
assert.equal(textClips[1].start, 2);

const exportDir = path.join(tempDir, "capcut");
const exportPath = exportToCapCut(
  { ...sequenceRun.ritual, timeline: sequenceRun.context.timeline },
  exportDir
);
assert.ok(fs.existsSync(exportPath));

console.log("Runner smoke OK");
