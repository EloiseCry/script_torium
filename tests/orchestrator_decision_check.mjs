import assert from "node:assert/strict";
import {
  decideNextStep,
  evaluateMode,
  resolveTemplatePath
} from "../engine/orchestrator/orchestrator.js";

const rules = {
  regla_bloqueo: {
    condicion: "ciclope.capas_pendientes > 0 AND modo === produccion",
    accion: "produccion_limitada"
  }
};

const baseState = {
  universo: "madonna_hibrida",
  modo: "produccion",
  template_actual: "madonna_hibrida_template",
  template_path: "pipelines/reels/madonna_hibrida/madonna_hibrida_template.arc",
  estado_media: { presente: 5, faltante: 0 },
  ciclope: { capas_pendientes: [] },
  saturacion: 0.2
};

assert.equal(
  evaluateMode(
    { ...baseState, modo: "produccion", ciclope: { capas_pendientes: ["capa_6"] } },
    rules
  ),
  "produccion_limitada"
);

assert.equal(
  decideNextStep({
    ...baseState,
    estado_media: { presente: 4, faltante: 1 },
    ciclope: { capas_pendientes: [] },
    saturacion: 0.1
  }),
  "resolver_media"
);

assert.equal(
  decideNextStep({
    ...baseState,
    estado_media: { presente: 5, faltante: 0 },
    ciclope: { capas_pendientes: ["capa_6"] },
    saturacion: 0.1
  }),
  "generar_pack_preview"
);

assert.equal(
  decideNextStep({
    ...baseState,
    estado_media: { presente: 5, faltante: 0 },
    ciclope: { capas_pendientes: [] },
    saturacion: 0.9
  }),
  "expandir_templates"
);

const resolvedTemplatePath = resolveTemplatePath(baseState);
assert.equal(resolvedTemplatePath, "pipelines/reels/madonna_hibrida/madonna_hibrida_template.arc");

console.log("Orchestrator decision OK");
