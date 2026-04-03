# Migración Lote 11

Objetivo:

- volver accionables los `replacementHints`,
- generar previews derivados desde plantillas,
- sin tocar los `.arc` fuente y sin falsificar hidratación final.

## Incluye

- `tools/materialize_placeholder_preview.mjs`
- `tests/placeholder_preview_materialization_check.mjs`
- output derivado en `runtime/previews/`

## Hallazgo principal

La plantilla `madonna_hibrida_template.arc` ya puede derivar un preview ejecutable:

- sustituye `4` placeholders visuales por candidates reales existentes,
- deja `1` placeholder de audio sin resolver,
- y conserva trazabilidad del origen en comentarios de cabecera.

## Regla Operativa

- los previews derivados viven en `runtime/previews/`
- no sustituyen al `.arc` fuente
- no cuentan como media final hidratada

## Conclusión

El sistema ya no sólo describe cómo reemplazar placeholders:

- también puede materializar un preview parcial verificable para iteración rápida.
