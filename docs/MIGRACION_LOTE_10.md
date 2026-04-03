# Migración Lote 10

Objetivo:

- formalizar placeholders como slots reutilizables,
- separar el plano de reemplazo del plano de evidencia real,
- y exponer sugerencias de sustitución desde el runner.

## Incluye

- `assets/source/media_replacements.json`
- `engine/media/replacements.js`
- `tools/report_media_replacements.mjs`
- `docs/MANIFIESTO_REEMPLAZO_PLACEHOLDERS.md`
- `tests/media_replacement_check.mjs`

## Hallazgo principal

Por ahora sólo existe un set explícito de placeholders reutilizables:

- `madonna_hibrida_template`

Ese set declara `5` slots:

- `visual_1`
- `visual_2`
- `visual_3`
- `visual_4`
- `audio_main`

## Ajuste técnico

El runner ahora conserva en runtime:

- `context.media.replacementHints`

Cada hint incluye:

- `slot`
- `acceptedPatterns`
- `previewCandidate`
- `previewCandidateExists`

## Conclusión

El repo maestro ya distingue dos planos distintos:

- qué media existe o falta realmente,
- y cómo reemplazar placeholders de plantilla sin convertirlos en cobertura falsa.
