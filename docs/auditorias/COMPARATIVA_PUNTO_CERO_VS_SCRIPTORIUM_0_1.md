# Comparativa: `scriptorium-arcontico punto cero` vs `SCRIPTORIUM🜇 0.1`

Fecha de comparación: 2026-04-02

## 1. Resumen corto

Las dos carpetas comparten memoria histórica, pero cumplen funciones distintas.

- `scriptorium-arcontico punto cero` = motor ARC, parser, runner, pipelines, assets, audio, export audiovisual.
- `SCRIPTORIUM🜇 0.1` = sistema editorial/generador de contenido con glosario, prompts, outputs Markdown y prototipo de sync con Notion.

No son duplicados.
Son ramas divergentes del mismo linaje.

## 2. Coincidencias reales

Coinciden exactamente en:

- `1.txt`
- `2.txt`
- `3.txt`
- `4.txt`
- `5.txt`
- `6.txt`

Hallazgo:

- los seis archivos son idénticos byte a byte en ambas carpetas.
- funcionan como memoria compartida del proyecto.

Coincidencias estructurales:

- ambas son carpetas git sin remotos configurados,
- ambas carecen de `.gitignore`,
- ambas mezclan contenido útil con residuos o estados no consolidados.

## 3. Diferencias de escala

### `SCRIPTORIUM🜇 0.1`

- tamaño aproximado: 53 MB
- directorios útiles: 10
- archivos útiles: 61

### `scriptorium-arcontico punto cero`

- tamaño aproximado: 396 MB
- directorios útiles: 38
- archivos útiles: 370

Lectura:

- `PUNTO_CERO` es mucho más grande, técnico y pesado;
- `0.1` es más compacto y orientado a contenido.

## 4. Diferencia de propósito

### `SCRIPTORIUM🜇 0.1`

Objetivo dominante:

- convertir glosario en contenido publicable,
- generar Markdown y JSON,
- operar con Notion y LLM.

Piezas centrales:

- `glosario_generator.py`
- `scriptorium.py`
- `publicar_hilo.py`
- `02_GLOSARIOS/glosario_maestro.json`
- `contenido_generado/`

### `scriptorium-arcontico punto cero`

Objetivo dominante:

- ejecutar rituales ARC,
- construir timeline,
- exportar a CapCut,
- trabajar reels/packs audiovisuales.

Piezas centrales:

- `parser/`
- `engine/`
- `pipelines/`
- `assets/`
- `audio/`

## 5. Diferencia de madurez

### `SCRIPTORIUM🜇 0.1`

Más maduro en:

- articulación conceptual,
- glosario JSON usable,
- prompts de generación,
- salidas textuales visibles,
- conexión clara con publicación escrita.

Más débil en:

- disciplina de dependencias,
- publicación automatizada real,
- seguridad de secretos,
- consistencia entre scripts.

### `scriptorium-arcontico punto cero`

Más maduro en:

- existencia de un stack técnico real para DSL/timeline/export,
- material audiovisual y outputs concretos,
- capacidad de ejecutar al menos una ruta del pipeline.

Más débil en:

- contrato interno del parser,
- documentación operativa,
- control de versiones,
- separación entre producto y experimento.

## 6. Diferencia en versionado

### `SCRIPTORIUM🜇 0.1`

- 4 commits
- historial centrado en documentación
- la automatización real está fuera de git

### `scriptorium-arcontico punto cero`

- 2 commits
- historial centrado en implementación y assets
- el trabajo posterior dejó el árbol profundamente sucio

Lectura:

- `0.1` versiona el discurso del sistema;
- `PUNTO_CERO` versiona el arranque técnico del sistema.

## 7. Comparación por riesgo

### Riesgos principales en `SCRIPTORIUM🜇 0.1`

- secreto expuesto en código,
- `venv` roto y duplicado,
- dependencia faltante (`anthropic`),
- incompatibilidad entre generador y publicador,
- outputs contaminados con `<thinking_process>`.

### Riesgos principales en `scriptorium-arcontico punto cero`

- parser no alineado con su consumidor,
- múltiples linajes de parser coexistiendo,
- hardcodes de rutas Windows,
- worktree excesivamente divergente,
- git inflado con binarios y outputs.

## 8. Qué carpeta contiene qué verdad

### Verdad conceptual

Gana `SCRIPTORIUM🜇 0.1`

Porque concentra:

- manifiesto,
- ontología,
- glosarios,
- prompts,
- movimientos,
- experimentos editoriales,
- outputs textuales utilizables.

### Verdad técnica audiovisual

Gana `scriptorium-arcontico punto cero`

Porque concentra:

- el DSL,
- parser/lexer/AST,
- runner,
- voz,
- exportador,
- assets,
- audio,
- reels y packs.

## 9. Solapamientos

El solapamiento entre ambas carpetas no es de archivos funcionales, sino de narrativa del proyecto.

Comparten:

- origen,
- vocabulario,
- memoria de decisiones,
- estética arcontica,
- idea de “movimientos” y “prompt ritual”.

No comparten:

- el mismo producto,
- el mismo runtime,
- la misma arquitectura final.

## 10. Conclusión estratégica

La mejor lectura no es “cuál reemplaza a cuál”.

La lectura correcta es:

- `scriptorium-arcontico punto cero` contiene el motor audiovisual/ARC;
- `SCRIPTORIUM🜇 0.1` contiene la capa editorial/generativa/Notion.

Si quisieras consolidar ambos mundos, la fusión sensata sería:

1. tomar de `PUNTO_CERO` el motor ARC, runner, export y assets;
2. tomar de `0.1` el glosario maestro, prompts híbridos, outputs textuales y disciplina editorial;
3. reconstruir un repositorio nuevo con fronteras claras entre:
   - `canon/`
   - `engine/`
   - `content/`
   - `runtime/outputs/`
   - `assets/`

## 11. Juicio final

`SCRIPTORIUM🜇 0.1` es más legible.

`scriptorium-arcontico punto cero` es más potente.

`SCRIPTORIUM🜇 0.1` está más cerca de una herramienta editorial.

`scriptorium-arcontico punto cero` está más cerca de un laboratorio técnico de media engine.

Ninguna de las dos carpetas está lista para convertirse sola en el repositorio maestro.
Las dos contienen piezas necesarias.
