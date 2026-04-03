# Scriptorium Maestro

Repositorio maestro para unificar dos linajes del proyecto:

- `SCRIPTORIUM🜇 0.1`: canon editorial, glosarios, prompts híbridos, generación textual.
- `scriptorium-arcontico punto cero`: motor ARC, parser, runner, pipelines audiovisuales y export CapCut.

## Principio de arquitectura

El repositorio se organiza por dominios:

- `canon/`: verdad editorial y semántica.
- `arc/`: módulos fuente del lenguaje ARC.
- `engine/`: parser, runner, acciones y exportadores.
- `integrations/`: puentes con LLM, Notion y publicación.
- `pipelines/`: fuentes de ejecución.
- `assets/`: material fuente y paquetes pesados.
- `runtime/`: outputs, caché y temporales no canónicos.
- `docs/`: auditorías, migración y gobierno técnico.
- `logs/`: memoria histórica y trazabilidad.

## Regla de oro

Nada generado en `runtime/` puede convertirse en fuente de verdad.

La verdad del sistema vive en:

- `canon/`
- `arc/`
- `engine/`
- `integrations/`
- `pipelines/`

## Estado

Este repositorio ya tiene dos lotes de consolidación activos.

Lote 1 migrado:

- base de higiene (`.gitignore`, `.env.example`)
- auditorías
- memoria de origen
- primer bloque de canon editorial

Lote 2 migrado:

- `arc/core/` y `arc/rituales/` rescatados desde `scriptorium-arcontico punto cero`
- parser ARC unificado con contrato normalizado para `steps`, `timeline` y `sequence`
- `engine/exporters/capcut_exporter.js` saneado
- `engine/preexport/voice_pipeline.js` deshardcodeado
- prueba de contrato del parser en `tests/parser_contract_check.mjs`

Lote 2.5 migrado:

- `engine/actions/` con acciones base ejecutables
- `engine/runner/` nuevo sobre el contrato actual del parser
- prueba de humo del runner en `tests/runner_smoke_check.mjs`

Lote 3 migrado:

- primer pipeline real en `pipelines/reels/madonna_hibrida/`
- verificación del runner sobre `madonna_hibrida_master.arc`

Lote 4 migrado:

- familia `kerigma_silencio_arconte` y `kerigma_master`
- soporte para `secuencia { incluye: ... }`
- soporte para acciones inline dentro de `timeline`

Lote 5 migrado:

- auditoría automatizada de referencias `assets/...` y `audio/...`
- política provisional de no inventar aliases
- reporte actual en `docs/AUDITORIA_ASSETS.md`

Lote 6 migrado:

- hidratación mínima real de `arconte/01-04.jpg`
- hidratación real de `audio/silencio_arconte.wav`
- medición de cobertura de media por pipeline

Lote 7 migrado:

- hidratación del pack oficial `madonna_hibrida_pack`
- aliases con evidencia para `assets/madonna_hibrida/01-04.jpg`
- `madonna_hibrida_acto2.arc` subido a cobertura parcial verificable

Lote 8 migrado:

- registro automatizado de refs faltantes con trazabilidad a `1.txt`..`6.txt`
- `report:missing-media` ahora refresca la auditoría antes de clasificar faltantes
- estado consolidado: `48` refs auditadas, `12` presentes en maestro y `36` aún ausentes
- deuda restante cerrada como problema de material faltante, no de ambigüedad documental

Lote 9 migrado:

- manifiesto canónico de media en `assets/source/media_canon.json`
- runner clasifica refs como `evidence_hydrated`, `placeholder_missing` o `declared_missing_final`
- reporte canónico en `docs/MANIFIESTO_MEDIA_CANONICA.md`
- separación operativa entre placeholders de plantilla y media final faltante

Lote 10 migrado:

- manifiesto de reemplazo de placeholders en `assets/source/media_replacements.json`
- `replacementHints` expuestos por el runner para plantillas
- reporte de reemplazo en `docs/MANIFIESTO_REEMPLAZO_PLACEHOLDERS.md`
- separación entre cobertura real y sugerencias de preview para placeholders

Lote 11 migrado:

- materialización de previews derivados desde placeholders
- salida no destructiva en `runtime/previews/`
- la plantilla `madonna_hibrida_template.arc` ya genera un preview parcial ejecutable

Lote 12 migrado:

- soporte para `preview_generator` en placeholders
- generación sintética de audio preview en `runtime/previews/media/`
- la plantilla `madonna_hibrida_template.arc` ya genera un preview completo `5/5`

Pendiente:

- hidratación real de media aún ausente:
  `assets/arconte/00.jpg`, `assets/arconte/05-12.jpg`,
  `assets/madonna_hibrida/05-12.jpg`, `assets/madonna_hibrida/__01-__04.jpg`,
  `assets/madonna/frame_01-07.jpg`, `assets/madonna/final_frame.jpg`,
  `audio/antes_del_silencio_cantos_de_ballena.wav`, `audio/transfiguracion.wav`,
  `audio/ascension.wav`, `audio/silencio_arconte_acto2.wav`,
  `audio/score_madonna_hibrida.wav`, `audio/vo_madonna_hibrida.wav`, `audio/__track.wav`
- automatizar sustitución de placeholders cuando aparezca media final real
- integración LLM/Notion/publicación
- política final para assets y binarios pesados
