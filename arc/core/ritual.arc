# ════════════════════════════════════════
#   RITUAL.ARC — NÚCLEO MÍNIMO OPERATIVO
#   Versión: 0.1 — Scriptorium Arcóntico  
# ════════════════════════════════════════

[ritual_core]
estado = "latente"
modo = "hybrid"
version = "0.1"

# Función principal del núcleo ritual
invoke ritual.origin {
    description = "Activa el estado híbrido básico del Scriptorium"
    outputs = ["umbral_abierto", "modo_hibrido", "pulso_estable"]
}

# Mapa mínimo de invocaciones
map ritual {
    origin = "invoke ritual.origin"
    invocacion = "invoke ritual.invocacion"
    limpieza = "invoke ritual.limpieza"
}

# Reglas simbólico-operativas
rules {
    umbral_abierto -> modo_hibrido
    modo_hibrido -> flujo_activo
}

# Estado esperado del sistema
expected_state {
    glosarios = "activos"
    ontologia = "coherente"
    manifiesto = "vigente"
}
#tipo: ritual
#macro_ritual: "init"
incluye:
  - ritual.generacion.arc
  - ritual.silencio.arc
invoke madonna_hibrida_pack {
    type: "pack_import"
    target: "madonna_hibrida"
    when: "on_start"
}
