function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export const ORCHESTRATOR_STATE_SCHEMA = {
  type: "object",
  required: ["modo", "ciclope", "estado_media"],
  properties: {
    modo: { type: "string", minLength: 1 },
    ciclope: {
      type: "object",
      required: ["capas_pendientes"],
      properties: {
        capas_pendientes: { type: "array" }
      }
    },
    estado_media: {
      type: "object",
      required: ["faltante"],
      properties: {
        faltante: { type: "number", minimum: 0 }
      }
    },
    saturacion: { type: "number", minimum: 0, maximum: 1 }
  }
};

export function validateState(state) {
  const errors = [];

  if (!isObject(state)) {
    throw new Error("Estado invalido: objeto requerido");
  }

  if (!isNonEmptyString(state.modo)) {
    errors.push("modo requerido (string no vacio)");
  }

  if (!isObject(state.ciclope)) {
    errors.push("ciclope requerido (objeto)");
  } else if (!Array.isArray(state.ciclope.capas_pendientes)) {
    errors.push("ciclope.capas_pendientes requerido (array)");
  }

  if (!isObject(state.estado_media)) {
    errors.push("estado_media requerido (objeto)");
  } else {
    const faltante = state.estado_media.faltante;
    if (!Number.isFinite(faltante) || faltante < 0) {
      errors.push("estado_media.faltante requerido (numero >= 0)");
    }
  }

  if (state.saturacion !== undefined) {
    if (!Number.isFinite(state.saturacion) || state.saturacion < 0 || state.saturacion > 1) {
      errors.push("saturacion fuera de rango (0..1)");
    }
  }

  if (errors.length > 0) {
    throw new Error(`Estado invalido: ${errors.join("; ")}`);
  }

  return state;
}
