/**
 * ## Regla inviolable: observer nunca llama orchestrator
 */

import fs from "fs";

const STATE_PATH = "./engine/orchestrator/state.json";

export function observe(event) {
  const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));

  let updatedState = { ...state };

  // Interpretación del evento
  if (event.type === "runner_execution") {
    updatedState.estado_media = {
      presente: event.payload.mediaPresent,
      faltante: event.payload.mediaMissing,
      placeholder: event.payload.mediaPlaceholder,
      replacementHints: event.payload.mediaReplacementHints
    };
  }

  updatedState.last_event = event.type;
  updatedState.timestamp_observer = new Date().toISOString();

  fs.writeFileSync(STATE_PATH, JSON.stringify(updatedState, null, 2));
}