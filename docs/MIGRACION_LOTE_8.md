# Migración Lote 8

Objetivo:

- distinguir entre media faltante con respaldo textual y media sin evidencia adicional,
- para dejar cerrada la búsqueda de origen sin seguir suponiendo.

## Incluye

- `tools/build_missing_media_registry.mjs`
- `docs/REGISTRO_MEDIA_FALTANTE.md`
- `runtime/outputs/missing_media_registry.json`

## Criterio

Una referencia faltante puede quedar en uno de dos estados:

- `declared_only_in_text_corpus`
- `no_material_evidence`

## Hallazgo principal

Las refs pendientes de `madonna_hibrida/05-12.jpg` y los audios faltantes sí aparecen
declaradas en el corpus textual de origen, especialmente en `4.txt`, pero no se
encuentran como archivos materiales en el árbol técnico disponible.

## Estado consolidado

- refs auditadas: `48`
- refs presentes en maestro: `12`
- refs aún ausentes en maestro: `36`
- refs ausentes con respaldo textual en `1.txt`..`6.txt`: `36`
- refs ausentes sin evidencia adicional: `0`

## Ajuste técnico

Se endureció `tools/build_missing_media_registry.mjs` para recalcular existencia real
en disco en lugar de confiar ciegamente en `existsInMaster` dentro de un `asset_audit.json`
potencialmente desactualizado. Además, `report:missing-media` ahora fuerza
`audit:assets` antes de regenerar el registro.

## Conclusión

La deuda restante ya no es ambigua:

- existe memoria documental de esos assets,
- pero no existe soporte material verificable en el origen accesible.
