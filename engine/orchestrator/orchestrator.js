import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  PROJECT_ROOT,
  DECISION_PATH,
  appendHistoryEntry,
  loadJson,
  loadState,
  saveState
} from "./state_store.js";

function asArcFilename(templateActual) {
  const raw = String(templateActual ?? "").trim();
  if (!raw) return null;
  return raw.endsWith(".arc") ? raw : `${raw}.arc`;
}

function candidateTemplatePaths(state) {
  const out = [];

  if (typeof state.template_path === "string" && state.template_path.trim()) {
    out.push(state.template_path.trim());
  }

  const arcFilename = asArcFilename(state.template_actual);
  const universo = String(state.universo ?? "").trim();

  if (universo && arcFilename) {
    out.push(path.join("pipelines", "reels", universo, arcFilename));
  }

  if (arcFilename) {
    const familyFromTemplate = arcFilename.replace(/\.arc$/i, "").replace(/_template$/i, "");
    if (familyFromTemplate) {
      out.push(path.join("pipelines", "reels", familyFromTemplate, arcFilename));
    }
  }

  return [...new Set(out)];
}

export function resolveTemplatePath(state, projectRoot = PROJECT_ROOT) {
  const candidates = candidateTemplatePaths(state);

  for (const relativeCandidate of candidates) {
    const absoluteCandidate = path.resolve(projectRoot, relativeCandidate);
    if (fs.existsSync(absoluteCandidate)) {
      return relativeCandidate.replace(/\\/g, "/");
    }
  }

  throw new Error(`No se pudo resolver template desde estado. Candidatos: ${candidates.join(", ")}`);
}

export function evaluateMode(state, rules) {
  const hasPendingLayers = (state?.ciclope?.capas_pendientes ?? []).length > 0;
  if (hasPendingLayers && state?.modo === "produccion") {
    return "produccion_limitada";
  }

  return state.modo;
}

export function decideNextStep(state) {
  if ((state?.estado_media?.faltante ?? 0) > 0) {
    return {
      actions: ["resolver_media"],
      priority: "media_missing",
      reasoning: "faltante > 0"
    };
  }

  if ((state?.ciclope?.capas_pendientes ?? []).length > 0) {
    return {
      actions: ["generar_pack_preview"],
      priority: "media_ready",
      reasoning: "no faltante + ciclope con capas pendientes"
    };
  }

  if ((state?.saturacion ?? 0) > 0.7) {
    return {
      actions: ["expandir_templates"],
      priority: "saturation_high",
      reasoning: "saturacion > 0.7"
    };
  }

  return {
    actions: ["generar_pack_preview"],
    priority: "steady_flow",
    reasoning: "flujo estable: continuar pack preview"
  };
}

function runRunner(templatePath) {
  const runnerPath = path.join(PROJECT_ROOT, "engine", "runner", "index.js");
  execFileSync(process.execPath, [runnerPath, templatePath], {
    stdio: "inherit",
    cwd: PROJECT_ROOT
  });
}

function runHydrateMedia() {
  if (process.platform === "win32") {
    execFileSync("cmd.exe", ["/d", "/s", "/c", "npm run hydrate:media"], {
      stdio: "inherit",
      cwd: PROJECT_ROOT
    });
    return;
  }

  execFileSync("npm", ["run", "hydrate:media"], {
    stdio: "inherit",
    cwd: PROJECT_ROOT
  });
}

function getPrimaryAction(decision) {
  if (!Array.isArray(decision?.actions) || decision.actions.length === 0) {
    return null;
  }
  return decision.actions[0];
}

function executeAction(decision, state) {
  const nextStep = getPrimaryAction(decision);
  try {
    if (nextStep === "generar_pack_preview") {
      const templatePath = resolveTemplatePath(state, PROJECT_ROOT);
      runRunner(templatePath);
      return;
    }

    if (nextStep === "continuar_ciclope") {
      console.log("Ciclope pendiente; se omite runner");
      return;
    }

    if (nextStep === "resolver_media") {
      runHydrateMedia();
      return;
    }

    if (nextStep === "expandir_templates") {
      console.log("expandir_templates: pendiente de implementar");
    }
  } catch (error) {
    console.error("Error ejecutando accion del orchestrator");
    console.error(error);
  }
}

export function runOrchestrator() {
  const state = loadState();
  const rules = loadJson(DECISION_PATH);

  const newMode = evaluateMode(state, rules);
  const decision = decideNextStep(state);
  const nextStep = getPrimaryAction(decision);
  const timestamp = new Date().toISOString();

  const updatedState = {
    ...state,
    modo: newMode,
    proximo_paso_sugerido: nextStep,
    decision_actual: decision,
    timestamp_orchestrator: timestamp
  };

  saveState(updatedState);
  appendHistoryEntry({
    timestamp,
    source: "orchestrator",
    decision,
    state_snapshot: updatedState
  });

  console.log("ORCHESTRATOR DECISION");
  console.log("---------------------");
  console.log("Modo:", newMode);
  console.log("Siguiente paso:", nextStep ?? "sin_accion");
  console.log("Prioridad:", decision.priority);
  console.log("Razon:", decision.reasoning);

  executeAction(decision, updatedState);

  return updatedState;
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    runOrchestrator();
  } catch (error) {
    console.error("ORCHESTRATOR ERROR");
    console.error(error);
    process.exitCode = 1;
  }
}
