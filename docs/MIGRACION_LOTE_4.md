# Migración Lote 4

Objetivo:

- migrar una segunda familia de pipelines reales,
- validar el runner contra la variante heredada `secuencia { incluye: ... }`.

## Pipeline migrado

- `pipelines/reels/kerigma_silencio_arconte/`
- `pipelines/reels/kerigma_master/`

## Verificación

El runner maestro ya ejecuta `kerigma_silencio_arconte_master.arc` y consolida
una línea de tiempo de 150 segundos.

## Compatibilidad añadida

- raíz envuelta con nombre libre, como `kerigma_acto2 { ... }`
- `segment` con `range:` interno
- acciones inline en `timeline`, como `emit_text` y `wait`
- `clip { ... }` dentro de `timeline`

## Hallazgos conservados

- `acto1.arc` está vacío en el origen
- varios assets declarados por los actos no están presentes en el árbol visible
- `reel_template.arc` usa `clip { ... }`, todavía fuera del contrato ejecutable principal
- la declaración de audio es mixta entre `meta.audio` y `assets.audio`; el runner actual sólo materializa `assets.audio`

## Actualización

El runner ya materializa `meta.audio` y usa `meta.duration` o `meta.duracion`
como duración ritual cuando están presentes.
