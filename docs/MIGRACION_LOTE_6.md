# Migración Lote 6

Objetivo:

- hidratar media mínima demostrable,
- y medir cobertura real por pipeline después de esa hidratación.

## Incluye

- `assets/source/hidratacion_inicial.json`
- `tools/hydrate_media_from_source.mjs`
- `tools/report_pipeline_media_coverage.mjs`
- `tests/hydrated_media_check.mjs`

## Media hidratada

- `assets/arconte/01.jpg`
- `assets/arconte/02.jpg`
- `assets/arconte/03.jpg`
- `assets/arconte/04.jpg`
- `audio/silencio_arconte.wav`

## Regla

Sólo se copió media realmente presente en el origen técnico.

## Estado resultante

La auditoría de referencias pasó a:

- `45` referencias únicas
- `5` presentes en origen técnico
- `5` presentes ya en el repositorio maestro

## Siguiente criterio

El próximo lote de media debe priorizar archivos que suban cobertura de pipelines
reales ya migrados, no assets huérfanos sin uso inmediato.
