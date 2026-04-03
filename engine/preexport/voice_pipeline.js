import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

function resolveEdgeTtsBinary(explicitPath) {
  if (explicitPath) return explicitPath;
  if (process.env.EDGE_TTS_PATH) return process.env.EDGE_TTS_PATH;
  return "edge-tts";
}

function estimateSpeechDuration(text) {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(2, words * 0.45);
}

function slugify(value) {
  return String(value || "voice")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function processVoices(timeline, outputDir, options = {}) {
  const edgeTtsBinary = resolveEdgeTtsBinary(options.edgeTtsPath);
  fs.mkdirSync(outputDir, { recursive: true });

  const assets = [];
  const subtitles = [];
  const voiceEvents = (timeline || []).filter(event => event.kind === "voice");

  voiceEvents.forEach((event, index) => {
    const stem = slugify(event.voice || `voice_${index}`);
    const audioPath = path.join(outputDir, `${index}_${stem}.wav`);

    execFileSync(
      edgeTtsBinary,
      [
        "--voice",
        event.voice || "es-MX-JorgeNeural",
        "--text",
        String(event.text || ""),
        "--write-media",
        audioPath
      ],
      { stdio: options.stdio || "ignore" }
    );

    const duration = estimateSpeechDuration(event.text);

    assets.push({
      type: "audio",
      src: audioPath,
      start: event.start ?? 0,
      duration,
      layer: event.layer ?? 0
    });

    if (event.subtitles !== false) {
      subtitles.push({
        type: "clip",
        clipType: "subtitle",
        value: String(event.text || ""),
        start: event.start ?? 0,
        duration,
        layer: event.layer ?? 3
      });
    }
  });

  return { assets, subtitles };
}

export default processVoices;
