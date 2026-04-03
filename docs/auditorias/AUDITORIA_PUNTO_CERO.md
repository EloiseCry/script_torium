# Auditoría Técnica de `scriptorium-arcontico punto cero`

Fecha de auditoría: 2026-04-02

## 1. Dictamen ejecutivo

`scriptorium-arcontico punto cero` es la rama técnica pesada del ecosistema Scriptorium.

Aquí sí existe un motor reconocible:

- ARC DSL,
- lexer,
- parser,
- AST,
- runner,
- export CapCut,
- pipelines,
- assets,
- audio,
- y packs audiovisuales.

Pero el estado actual no es limpio ni estable.

Diagnóstico resumido:

- hay evidencia clara de implementación real y outputs reales;
- el repositorio está fuertemente orientado a video/timeline/export;
- el árbol de trabajo está muy desalineado del último commit;
- el parser y el runner no comparten todavía un contrato consistente;
- la documentación es más esquemática que operativa;
- el proyecto conserva intentos editoriales paralelos (`AGENTS.md`, `SCRIPTORIUM_ARCONTICO`, `arconte`) que no terminaron de integrarse.

No es una carpeta conceptual.
Es una base técnica viva, pero todavía frágil.

## 2. Inventario funcional

### 2.1 Núcleo del motor

Directorios principales:

- `core/`
- `parser/`
- `engine/`
- `pipelines/`
- `rituales/`
- `tools/`
- `test/`

Qué representa:

- `core/`: manifiesto, ontología, glosarios y módulos de operación ARC.
- `parser/`: tokenización, parseo ritual/kernel, AST y transformación.
- `engine/`: runner, acciones, conversión y exportadores.
- `pipelines/`: fuentes `.arc`, manifests y outputs `.capcut.json`.
- `rituales/`: rituales base del sistema.

### 2.2 Capa audiovisual

Directorios:

- `assets/`
- `audio/`
- `pipelines/capcut_pack/`

Qué representa:

- materia prima real para composición,
- paquetes de salida para CapCut,
- evidencia de uso productivo del sistema.

### 2.3 Capa meta/editorial superpuesta

Directorios y archivos:

- `AGENTS.md`
- `SCRIPTORIUM_ARCONTICO/`
- `arconte/`

Qué representa:

- intento posterior de canon editorial/tokenizado,
- influido por la misma genealogía que luego reaparece en `SCRIPTORIUM🜇 0.1`,
- todavía periférico respecto al motor ARC.

### 2.4 Bitácora forense

- `1.txt` a `6.txt`

Hallazgo:

- son idénticos byte a byte a los mismos archivos en `SCRIPTORIUM🜇 0.1`.
- funcionan como memoria histórica compartida entre ambas carpetas.

## 3. Origen reconstruido

La carpeta nace de un proceso distinto al de `SCRIPTORIUM🜇 0.1`.

Secuencia probable:

1. Se parte de la exploración de prompts/agentes y del marco arcontico.
2. El foco se desplaza al motor ARC como lenguaje ejecutable.
3. Se construyen parser, runner y export a CapCut.
4. Se producen reels/packs reales.
5. Después se intenta superponer una capa editorial/canónica (`SCRIPTORIUM_ARCONTICO/`, `arconte/`, `AGENTS.md`).

La relación entre capas no quedó cerrada.

## 4. Estado del repositorio

### 4.1 Git

- Rama: `main`
- Commits visibles: 2
- Remotos: ninguno configurado

Commit base:

- `23be4b9` introduce prácticamente todo el repositorio, incluidos assets binarios grandes.

Commit posterior:

- `2748d21` ajusta `convert_reel.js` y un output CapCut.

Conclusión:

- el historial es mínimo para el tamaño real del sistema;
- casi toda la evolución posterior quedó fuera de commits.

### 4.2 Tamaño y composición

Tamaño total aproximado: 396 MB

Bloques más pesados:

- `.git`: 174 MB
- `assets/`: 132 MB
- `pipelines/`: 67 MB
- `audio/`: 23 MB

Conclusión:

- el repositorio versiona binarios pesados;
- el coste de mantenimiento y diffs es alto;
- el histórico git está inflado por assets y outputs.

### 4.3 Estado del worktree

El árbol está muy sucio:

- decenas de archivos modificados,
- varios eliminados,
- múltiples archivos/directorios nuevos no commiteados,
- cambios repartidos por `core/`, `parser/`, `engine/`, `pipelines/`, `docs/`.

Impacto:

- cuesta saber cuál es la versión “buena”;
- hay riesgo alto de mezclar exploración con estado productivo.

## 5. Ejecución verificada

### 5.1 Node

Probado con `C:\Program Files\nodejs\node.exe`:

- Node existe y funciona.
- `test.js` corre bien.

### 5.2 Parser

`test_parser.js`:

- tokeniza correctamente,
- pero falla en parseo con:
  `Cannot read properties of undefined (reading 'length')`

Causa observable:

- `parser/arc_ritual_parser.js` espera `ast.steps`,
- pero `parser/arc_ast.js` devuelve un documento con `sections`, no con `steps`.

Conclusión:

- lexer y parser no están totalmente alineados.

### 5.3 Runner

Probado con:

- `engine/runner.js pipelines/reels/madonna_hibrida/madonna_hibrida_master.arc`

Resultado:

- corre sin romperse,
- pero produce `ritual_sin_nombre`,
- detecta sólo 2 pasos,
- termina exportando `ritual_sin_nombre.capcut.json`.

Conclusión:

- el runner ejecuta una ruta simplificada,
- pero la semántica del ritual no está bien preservada.

## 6. Hallazgos críticos

### 6.1 Contrato roto entre parser y consumidor

Problema:

- `arc_ritual_parser.js` asume `ast.name` y `ast.steps`,
- `arc_ast.js` produce `type: "document"` y `sections`.

Impacto:

- pruebas fallidas,
- integración parcial,
- capa de parseo no confiable como fuente única de verdad.

### 6.2 Runner y parser usan rutas semánticas distintas

Problema:

- `engine/runner.js` usa `parseARC` desde `parser/arc_parser.js`,
- mientras el stack más “nuevo” parece vivir en `arc_lexer.mjs` + `arc_ast.js` + `arc_ritual_parser.js`.

Impacto:

- existen dos linajes de parser coexistiendo;
- el motor no está realmente unificado.

### 6.3 Export de voz con ruta hardcodeada

`engine/preexport/voice_pipeline.js` fija:

- `C:\Users\alien\AppData\Roaming\Python\Python314\Scripts\edge-tts.exe`

Impacto:

- acoplamiento total a una máquina concreta,
- fragilidad al mover entorno o cambiar versión de Python.

### 6.4 Documentación incompleta

Archivos como:

- `docs/README.md`
- `docs/ROADMAP.md`
- `docs/ARC_SYNTAX.md`
- `docs/VALIDATION.md`

están en forma de apuntes, no de manual operativo.

Impacto:

- el conocimiento real vive más en el código y en `1.txt`–`6.txt` que en `docs/`.

### 6.5 Peso excesivo en git

El commit inicial mete:

- assets masivos,
- audio,
- zip de pack,
- outputs generados.

Impacto:

- repositorio caro de clonar,
- historial poco maniobrable,
- diffs ruidosos.

### 6.6 Intento de canon editorial incompleto

`SCRIPTORIUM_ARCONTICO/`, `arconte/`, y lo descrito en `1.txt` apuntan a una estructura editorial más madura.

Pero en esta carpeta:

- no existe `README.md` raíz,
- no existe `.github/`,
- no existe `CONTRIBUTING.md`,
- no existe `.editorconfig`.

Conclusión:

- el intento de canon no se materializó aquí;
- quedó más como injerto documental que como reestructura efectiva.

## 7. Qué sí está sólido

- existe un motor real de experimentación ARC;
- hay assets, audio y packs de salida reales;
- hay manifests y reel sources suficientes para reconstruir intención operativa;
- el runner sí ejecuta una parte del flujo;
- la exportación a CapCut existe y produce archivos.

## 8. Qué está a medio cocinar

- unificación del parser;
- validación robusta;
- acciones del engine más allá de las mínimas;
- integración limpia de voz;
- documentación seria;
- criterio de versionado para binarios;
- frontera entre canon editorial y motor técnico.

## 9. Lectura correcta de esta carpeta

`scriptorium-arcontico punto cero` no es una versión previa “menor”.

Es:

- el taller mecánico del universo ARC,
- la rama donde sí se intentó materializar el DSL y el pipeline audiovisual,
- pero también un repositorio con deuda de arquitectura y de control de versiones.

## 10. Conclusión

Si `SCRIPTORIUM🜇 0.1` es el prototipo editorial-operativo, `scriptorium-arcontico punto cero` es el prototipo técnico-audiovisual.

Esta carpeta contiene la infraestructura más potente del ecosistema, pero también la más desordenada.

No está lista para consolidarse como producto.
Sí está lista para una refactorización seria en la que se separen:

- parser estable,
- runner estable,
- assets/output,
- canon documental,
- y experimentos.
