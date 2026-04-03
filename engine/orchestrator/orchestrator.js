/**
 * ## “El Orchestrator no busca permiso.
 * Solo alinea estado con acción.”
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const STATE_PATH = "./engine/orchestrator/state.json";
const DECISION_PATH = "./engine/orchestrator/decision_table.json";

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function saveJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function evaluateMode(state, rules) {
  const bloqueo = rules.regla_bloqueo;

  if (
    state.ciclope.capas_pendientes.length > 0 &&
    state.modo === "produccion"
  ) {
    return "produccion_limitada";
  }

  return state.modo;
}

function decideNextStep(state) {
  if (state.estado_media.faltante > 0) {
    return "resolver_media";
  }

  if (state.ciclope.capas_pendientes.length > 0) {
    return "generar_pack_preview"; // 👈 CAMBIO CLAVE
  }

  if (state.saturacion > 0.7) {
    return "expandir_templates";
  }

  return "generar_pack_preview";
}

// 🔥 EJECUCIÓN AUTOMÁTICA SEGÚN DECISIÓN

function executeAction(nextStep, state) {
  try {
    if (nextStep === "generar_pack_preview") {
      console.log("⚙️ Ejecutando ARC runner...");

      execSync(
        `node engine/runner/index.js pipelines/reels/madonna_hibrida/madonna_hibrida_template.arc`,
        { stdio: "inherit" }
      );
    }

    if (nextStep === "continuar_ciclope") {
      console.log("🧬 Ciclope pendiente → no se ejecuta runner");
    }

    if (nextStep === "resolver_media") {
      console.log("🧩 Ejecutar hidratación de media");
      execSync(`npm run hydrate:media`, { stdio: "inherit" });
    }

    if (nextStep === "expandir_templates") {
      console.log("🚀 Escalando templates...");
      // futuro hook
    }

  } catch (err) {
    console.error("🔥 ERROR EJECUTANDO ACCIÓN");
    console.error(err);
  }
}

export function runOrchestrator() {
  const state = loadJSON(STATE_PATH);
  const rules = loadJSON(DECISION_PATH);

  const newMode = evaluateMode(state, rules);
  const nextStep = decideNextStep(state);

  const updatedState = {
    ...state,
    modo: newMode,
    proximo_paso_sugerido: nextStep,
    timestamp_orchestrator: new Date().toISOString()
  };

  saveJSON(STATE_PATH, updatedState);

  console.log("🧠 ORCHESTRATOR DECISION");
  console.log("----------------------");
  console.log("Modo:", newMode);
  console.log("Siguiente paso:", nextStep);

  executeAction(nextStep, updatedState);

  return updatedState;
}

// 🔥 AQUÍ — fuera de la función
try {
  runOrchestrator();
} catch (err) {
  console.error("🔥 ORCHESTRATOR ERROR");
  console.error(err);
}