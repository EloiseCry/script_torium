# Migración Lote 5

Objetivo:

- convertir la deuda de assets en una auditoría repetible,
- sin falsificar rutas ni inventar aliases no demostrables.

## Incluye

- `tools/audit_asset_references.mjs`
- `assets/README.md`
- `docs/AUDITORIA_ASSETS.md`
- `runtime/outputs/asset_audit.json`

## Resultado

El repositorio maestro ya puede auditar automáticamente todas las referencias
`assets/...` y `audio/...` declaradas por los pipelines.

## Estado medido

- referencias únicas auditadas: `45`
- presentes en origen técnico: `5`
- ausentes en origen técnico: `40`
- presentes en maestro: `0`

## Lectura

La deuda no es un problema de renombre menor: la mayoría de las rutas referidas
por los `.arc` no existen ni siquiera en el linaje técnico de origen.

## Regla fijada

No se crean aliases sintéticos hasta que exista evidencia material suficiente para
mapear una referencia declarada con un archivo real concreto.
