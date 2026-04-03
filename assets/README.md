# Assets

Este directorio ya contiene una hidratación mínima verificable.

## Regla actual

- Los pipelines pueden referenciar assets y audio históricos.
- La existencia real de esos archivos se valida con `tools/audit_asset_references.mjs`.
- No se inventan aliases ni renombres sin evidencia material del origen.

## Estado observado

- En `scriptorium-maestro` hay media real hidratada para `arconte/01-04.jpg`,
  `madonna_hibrida/01-04.jpg` y `audio/silencio_arconte.wav`.
- En el origen técnico sólo existe una fracción mínima de las referencias usadas por los `.arc`.

## Hidratacion inicial

Existe un primer manifiesto real en `assets/source/hidratacion_inicial.json`.

Su propósito es copiar únicamente media demostrable desde el origen técnico:

- `assets/arconte/01.jpg`
- `assets/arconte/02.jpg`
- `assets/arconte/03.jpg`
- `assets/arconte/04.jpg`
- `audio/silencio_arconte.wav`
- `pipelines/capcut_pack/madonna_hibrida_pack/assets/01-04.jpg`
- `pipelines/capcut_pack/madonna_hibrida_pack/audio/silencio_arconte.wav`
- `assets/madonna_hibrida/01-04.jpg` por evidencia directa desde el pack oficial

## Siguiente fase

- el manifiesto canónico ya vive en `assets/source/media_canon.json`
- el manifiesto de reemplazo de placeholders vive en `assets/source/media_replacements.json`
- el runner ya distingue entre `evidence_hydrated`, `placeholder_missing`
  y `declared_missing_final`
- los placeholders pueden exponer `replacementHints` sin contaminar la cobertura real
- los previews derivados pueden generar media sintética en `runtime/previews/media/`
  para iteración, sin promoverla a media final
- la deuda pendiente es hidratar media final real sin confundirla con placeholders
