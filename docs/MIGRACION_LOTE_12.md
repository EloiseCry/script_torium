# Migración Lote 12

Objetivo:

- cerrar el hueco de `audio_main` en previews derivados,
- permitir media sintética de preview,
- y dejar los templates listos para ejecución completa sin fingir media final.

## Incluye

- soporte `preview_generator` en `assets/source/media_replacements.json`
- generación de WAV de silencio desde `tools/materialize_placeholder_preview.mjs`
- actualización de pruebas de reemplazo y materialización

## Hallazgo principal

La plantilla `madonna_hibrida_template.arc` ya puede derivar un preview `5/5`:

- `4` visuales reemplazados por media existente
- `1` audio generado como preview sintético

## Regla Operativa

- los assets generados de preview viven bajo `runtime/previews/media/`
- son válidos para iteración y export experimental
- no cuentan como hidratación final ni como evidencia material del linaje fuente

## Conclusión

El sistema de placeholders ya no se queda en diagnóstico:

- puede producir previews completos,
- manteniendo separadas la iteración operativa y la verdad histórica del corpus.
