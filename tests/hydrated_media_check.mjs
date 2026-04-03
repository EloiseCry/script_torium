import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "assets/arconte/01.jpg",
  "assets/arconte/02.jpg",
  "assets/arconte/03.jpg",
  "assets/arconte/04.jpg",
  "audio/silencio_arconte.wav"
];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `${relativePath} no existe`);
  assert.ok(fs.statSync(absolutePath).size > 0, `${relativePath} está vacío`);
}

console.log("Hydrated media OK");
