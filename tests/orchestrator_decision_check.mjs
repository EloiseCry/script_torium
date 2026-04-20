import assert from "node:assert/strict";
import {
  decideNextStep,
  evaluateMode,
  resolveTemplatePath
} from "../engine/orchestrator/orchestrator.js";
import { validateState } from "../engine/orchestrator/state_schema.js";

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

assert.deepEqual(
  decideNextStep({
    ...baseState,
    estado_media: { presente: 4, faltante: 1 },
    ciclope: { capas_pendientes: [] },
    saturacion: 0.1
  }),
  {
    actions: ["resolver_media"],
    priority: "media_missing",
    reasoning: "faltante > 0"
  }
);

assert.deepEqual(
  decideNextStep({
    ...baseState,
    estado_media: { presente: 5, faltante: 0 },
    ciclope: { capas_pendientes: ["capa_6"] },
    saturacion: 0.1
  }),
  {
    actions: ["generar_pack_preview"],
    priority: "media_ready",
    reasoning: "no faltante + ciclope con capas pendientes"
  }
);

assert.deepEqual(
  decideNextStep({
    ...baseState,
    estado_media: { presente: 5, faltante: 0 },
    ciclope: { capas_pendientes: [] },
    saturacion: 0.9
  }),
  {
    actions: ["expandir_templates"],
    priority: "saturation_high",
    reasoning: "saturacion > 0.7"
  }
);

const resolvedTemplatePath = resolveTemplatePath(baseState);
assert.equal(resolvedTemplatePath, "pipelines/reels/madonna_hibrida/madonna_hibrida_template.arc");
assert.equal(validateState(baseState), baseState);
assert.throws(
  () => validateState({ ...baseState, modo: "", ciclope: null }),
  /Estado invalido/
);

console.log("Orchestrator decision OK");
