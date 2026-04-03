# Migración Lote 2

Objetivo:

- rescatar el núcleo ARC desde `scriptorium-arcontico punto cero`,
- sin arrastrar el parser roto ni el acoplamiento local del entorno original.

## Incluye

- `arc/core/*.arc`
- `arc/rituales/*.arc`
- `engine/parser/` con contrato unificado
- `engine/exporters/capcut_exporter.js`
- `engine/preexport/voice_pipeline.js`
- `tests/parser_contract_check.mjs`
- `package.json`

## Cambio principal

Se reemplaza la fragmentación heredada por un parser unificado que expone:

- `steps`
- `timeline`
- `sequence`
- `meta`
- `assets`
- `styles`
- `requires`

en una sola forma normalizada.

## No incluye todavía

- runner heredado,
- acciones del engine,
- pipelines completos,
- assets pesados,
- audio,
- outputs `.capcut.json`

## Razón

El runner antiguo no debe migrarse hasta que el contrato del parser quede estable.
