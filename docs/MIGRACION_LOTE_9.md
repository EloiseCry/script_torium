# Migración Lote 9

Objetivo:

- fijar una política ejecutable de media,
- separar placeholders de media final faltante,
- y propagar esa clasificación al runner y a la documentación canónica.

## Incluye

- `assets/source/media_canon.json`
- `engine/media/catalog.js`
- `tools/report_media_canon.mjs`
- `docs/MANIFIESTO_MEDIA_CANONICA.md`
- `tests/media_catalog_check.mjs`

## Estados canónicos

- `evidence_hydrated`
- `placeholder_missing`
- `declared_missing_final`

## Hallazgo principal

La deuda de media ya no es un bloque indiferenciado:

- hay `12` refs realmente utilizables hoy,
- hay `5` refs que pertenecen a plantillas placeholder,
- y hay `31` refs de media final documentada pero aún no recuperada.

## Ajuste técnico

El runner ahora clasifica refs al vuelo usando el manifiesto:

- `context.media.hydrated`
- `context.media.placeholder`
- `context.media.declaredMissing`
- `context.media.uncatalogued`

Las advertencias siguen siendo compatibles con el flujo anterior, pero ahora incluyen
el estado canónico entre corchetes.

## Conclusión

El repositorio maestro ya distingue entre:

- media real disponible,
- media placeholder aceptada para plantillas,
- y media final pendiente de reconstrucción o recuperación.
