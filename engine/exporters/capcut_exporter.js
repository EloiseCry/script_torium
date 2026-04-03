import fs from "fs";
import path from "path";

function normalizeClip(clip, index) {
  return {
    id: index,
    type: clip.clipType ?? clip.type ?? "clip",
    src: clip.src ?? null,
    text: clip.value ?? clip.text ?? null,
    start: clip.start ?? 0,
    duration: clip.duration ?? 0,
    layer: clip.layer ?? 0,
    style: clip.style ?? {}
  };
}

export function exportToCapCut(ritual, outDir) {
  fs.mkdirSync(outDir, { recursive: true });

  const timeline = Array.isArray(ritual.timeline) ? ritual.timeline : [];
  const clips = timeline.map(normalizeClip);

  const project = {
    name: ritual.name || "ritual_sin_nombre",
    fps: 30,
    resolution: "1080x1920",
    tracks: {
      video: clips.filter(clip => clip.type !== "audio"),
      audio: clips.filter(clip => clip.type === "audio")
    }
  };

  const fileName = `${project.name}.capcut.json`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(project, null, 2), "utf-8");
  return filePath;
}

export default exportToCapCut;
