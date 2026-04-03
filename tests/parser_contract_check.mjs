import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArc } from "../engine/parser/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const stepRitualPath = path.join(root, "arc", "rituales", "ritual.invocacion.arc");
const stepRitualSource = fs.readFileSync(stepRitualPath, "utf8");
const parsedStep = parseArc(stepRitualSource, { filePath: stepRitualPath });

assert.equal(parsedStep.type, "ritual");
assert.equal(parsedStep.dialect, "steps");
assert.ok(Array.isArray(parsedStep.steps));
assert.ok(parsedStep.steps.length > 0);
assert.ok(Array.isArray(parsedStep.requires));
assert.ok(parsedStep.requires.length > 0);

const timelineSource = `
reel demo_reel {
  meta {
    version = "1.0"
  }

  assets {
    img1 = "assets/demo/01.jpg"
  }

  timeline {
    range 0-3 {
      img = img1
      text = "Umbral"
    }
  }

  styles {
    font_primary = "Bodoni"
  }
}
`;

const parsedTimeline = parseArc(timelineSource, { filePath: "demo_reel.arc" });
assert.equal(parsedTimeline.type, "ritual");
assert.equal(parsedTimeline.dialect, "timeline");
assert.equal(parsedTimeline.name, "demo_reel");
assert.equal(parsedTimeline.timeline.length, 1);
assert.equal(parsedTimeline.timeline[0].props.text, "Umbral");
assert.equal(parsedTimeline.assets.img1, "assets/demo/01.jpg");

const sequenceSource = `
ritual demo_sequence {
  secuencia {
    incluye: "pipelines/reels/acto1.arc"
    incluye: "pipelines/reels/acto2.arc"
  }
}
`;

const parsedSequence = parseArc(sequenceSource, { filePath: "demo_sequence.arc" });
assert.equal(parsedSequence.dialect, "sequence");
assert.equal(parsedSequence.sequence.length, 2);
assert.equal(parsedSequence.sequence[0].name, "acto1");
assert.equal(parsedSequence.sequence[1].props.file, "pipelines/reels/acto2.arc");

console.log("Parser contract OK");
