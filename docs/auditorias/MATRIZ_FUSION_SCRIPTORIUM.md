# Matriz de Fusión Scriptorium

Fecha: 2026-04-02

Fuentes auditadas:

- `C:\Users\alien\SCRIPTORIUM🜇 0.1`
- `C:\Users\alien\scriptorium-arcontico punto cero`

## 1. Objetivo de la fusión

Construir un repositorio maestro que una:

- la capa editorial/generativa de `SCRIPTORIUM🜇 0.1`,
- con la capa técnica/audiovisual de `scriptorium-arcontico punto cero`,

sin arrastrar:

- secretos expuestos,
- binarios innecesarios en git,
- outputs accidentales,
- contratos rotos entre parser/runner/generador.

## 2. Principio rector

No fusionar carpetas enteras.

Fusionar por dominio funcional.

Eso evita repetir el error actual:

- una carpeta demasiado conceptual pero técnica incompleta,
- y otra demasiado técnica pero editorialmente dispersa.

## 3. Veredicto por dominio

| Dominio | Fuente dominante | Decisión | Destino propuesto |
|---|---|---|---|
| Manifiesto y ontología editorial | `SCRIPTORIUM🜇 0.1` | Conservar y migrar | `canon/00_manifiesto/`, `canon/01_ontologia/` |
| Glosario editorial listo para LLM | `SCRIPTORIUM🜇 0.1` | Conservar y migrar | `canon/02_glosarios/` |
| Core ARC en `.arc` | `PUNTO_CERO` | Conservar y normalizar | `arc/core/` |
| Rituales base `.arc` | `PUNTO_CERO` | Conservar y depurar | `arc/rituales/` |
| Parser ARC | `PUNTO_CERO` | Conservar, refactor obligatorio | `engine/parser/` |
| Runner ARC | `PUNTO_CERO` | Conservar, refactor obligatorio | `engine/runner/` |
| Export CapCut | `PUNTO_CERO` | Conservar | `engine/exporters/` |
| Preexport voz/subtítulos | `PUNTO_CERO` | Conservar, deshardcodear | `engine/preexport/` |
| Generador LLM para glosario | `SCRIPTORIUM🜇 0.1` | Conservar, corregir | `integrations/llm/` |
| Sync Notion | `SCRIPTORIUM🜇 0.1` | Conservar como prototipo | `integrations/notion/` |
| Publicador X/Twitter | `SCRIPTORIUM🜇 0.1` | Conservar, reescribir contrato | `integrations/publishing/` |
| Prompt base híbrido | `SCRIPTORIUM🜇 0.1` | Conservar | `canon/03_prompts_base/` |
| AGENTS / meta-arconte | `PUNTO_CERO` | Conservar selectivamente | `canon/04_agents/` |
| Experimentos editoriales | `SCRIPTORIUM🜇 0.1` | Conservar | `canon/05_experimentos/` |
| Pipelines reels/stories/feed | `PUNTO_CERO` | Conservar | `pipelines/` |
| Assets visuales | `PUNTO_CERO` | Conservar fuera de git pesado | `assets/source/` |
| Audio | `PUNTO_CERO` | Conservar fuera de git pesado | `assets/audio/` |
| Packs y outputs generados | ambos | No canonizar | `runtime/outputs/` |
| Caches | `SCRIPTORIUM🜇 0.1` | No canonizar | `runtime/cache/` |
| Transcripciones `1.txt`–`6.txt` | ambos | Conservar como memoria | `logs/origen/` |

## 4. Estructura objetivo del repositorio maestro

```text
scriptorium-maestro/
├── README.md
├── .gitignore
├── .env.example
├── canon/
│   ├── 00_manifiesto/
│   ├── 01_ontologia/
│   ├── 02_glosarios/
│   ├── 03_prompts_base/
│   ├── 04_agents/
│   └── 05_experimentos/
├── arc/
│   ├── core/
│   └── rituales/
├── engine/
│   ├── parser/
│   ├── runner/
│   ├── actions/
│   ├── exporters/
│   └── preexport/
├── integrations/
│   ├── llm/
│   ├── notion/
│   └── publishing/
├── pipelines/
│   ├── reels/
│   ├── stories/
│   ├── feed/
│   ├── carruseles/
│   └── weekly/
├── assets/
│   ├── source/
│   ├── audio/
│   └── packs/
├── runtime/
│   ├── cache/
│   ├── outputs/
│   └── temp/
├── tests/
├── docs/
└── logs/
    └── origen/
```

## 5. Matriz detallada de migración

### 5.1 Canon editorial

| Origen actual | Acción | Destino nuevo | Motivo |
|---|---|---|---|
| `SCRIPTORIUM🜇 0.1/00_MANIFIESTO/` | Migrar | `canon/00_manifiesto/` | Base conceptual más legible |
| `SCRIPTORIUM🜇 0.1/01_ONTOLOGIA/` | Migrar | `canon/01_ontologia/` | Ontología editorial ya usable |
| `SCRIPTORIUM🜇 0.1/02_GLOSARIOS/` | Migrar | `canon/02_glosarios/` | Glosarios mejor articulados |
| `SCRIPTORIUM🜇 0.1/03_PROMPTS_BASE/` | Migrar | `canon/03_prompts_base/` | Prompt base híbrido ya operativo |
| `SCRIPTORIUM🜇 0.1/04_MOVIMIENTOS/` | Migrar | `docs/movimientos/` | Memoria de hitos, no runtime |
| `SCRIPTORIUM🜇 0.1/05_EXPERIMENTOS/` | Migrar | `canon/05_experimentos/` | Evidencia editorial valiosa |
| `PUNTO_CERO/AGENTS.md` | Extraer y fragmentar | `canon/04_agents/` | Demasiado mezclado para vivir como archivo único |
| `PUNTO_CERO/SCRIPTORIUM_ARCONTICO/` | Revisar manualmente | `canon/04_agents/` o `docs/legacy/` | Intento de canon incompleto |
| `PUNTO_CERO/arconte/` | Revisar manualmente | `docs/legacy/` | Compatibilidad/archivo histórico |

### 5.2 Núcleo ARC

| Origen actual | Acción | Destino nuevo | Motivo |
|---|---|---|---|
| `PUNTO_CERO/core/` | Migrar | `arc/core/` | Núcleo real del DSL |
| `PUNTO_CERO/rituales/` | Migrar | `arc/rituales/` | Rituales base del sistema |
| `PUNTO_CERO/parser/` | Migrar con refactor | `engine/parser/` | Existe valor, pero el contrato está roto |
| `PUNTO_CERO/engine/runner.js` | Migrar con refactor | `engine/runner/index.js` | Runner funcional pero simplificado |
| `PUNTO_CERO/engine/engine_actions.js` | Migrar con refactor | `engine/actions/arc_actions.js` | Muy incompleto hoy |
| `PUNTO_CERO/engine/exporters/` | Migrar | `engine/exporters/` | Mejor pieza cerrada del stack |
| `PUNTO_CERO/engine/preexport/` | Migrar con refactor | `engine/preexport/` | Útil, pero hardcodeado |

### 5.3 Integraciones

| Origen actual | Acción | Destino nuevo | Motivo |
|---|---|---|---|
| `SCRIPTORIUM🜇 0.1/glosario_generator.py` | Migrar con refactor | `integrations/llm/glosario_generator.py` | Conecta bien glosario y publicación |
| `SCRIPTORIUM🜇 0.1/scriptorium.py` | Migrar con refactor | `integrations/notion/sync_manager.py` | Prototipo valioso, modelo de datos flojo |
| `SCRIPTORIUM🜇 0.1/publicar_hilo.py` | Reescribir antes de migrar | `integrations/publishing/publish_x.py` | Contrato roto con outputs actuales |
| `SCRIPTORIUM🜇 0.1/test_connection.py` | No migrar tal cual | `tests/integrations/test_notion_config.py` | Contiene secreto expuesto |

### 5.4 Pipelines y media

| Origen actual | Acción | Destino nuevo | Motivo |
|---|---|---|---|
| `PUNTO_CERO/pipelines/reels/` | Migrar | `pipelines/reels/` | Fuente principal de video |
| `PUNTO_CERO/pipelines/stories/` | Migrar | `pipelines/stories/` | Misma familia de ejecución |
| `PUNTO_CERO/pipelines/feed/` | Migrar | `pipelines/feed/` | Misma familia de ejecución |
| `PUNTO_CERO/pipelines/carruseles/` | Migrar | `pipelines/carruseles/` | Útil como contenido fuente |
| `PUNTO_CERO/pipelines/weekly/` | Migrar | `pipelines/weekly/` | Estructura de calendario |
| `PUNTO_CERO/assets/` | Migrar selectivamente | `assets/source/` | No todo debe ir a git |
| `PUNTO_CERO/audio/` | Migrar selectivamente | `assets/audio/` | Igual criterio |
| `PUNTO_CERO/pipelines/capcut_pack/` | No canonizar completo | `runtime/outputs/capcut_pack/` | Es output, no fuente |
| `SCRIPTORIUM🜇 0.1/contenido_generado/` | No canonizar completo | `runtime/outputs/content/` | Output editorial |

### 5.5 Memoria y trazabilidad

| Origen actual | Acción | Destino nuevo | Motivo |
|---|---|---|---|
| ambos `1.txt`–`6.txt` | Migrar una sola copia | `logs/origen/` | Origen histórico común |
| auditorías actuales | Migrar | `docs/auditorias/` | Base de gobierno del sistema |
| caches JSON | No canonizar | `runtime/cache/` | Estado derivado |

## 6. Qué no debe fusionarse tal cual

### No migrar sin saneamiento

- `SCRIPTORIUM🜇 0.1/test_connection.py`
- `SCRIPTORIUM🜇 0.1/.env`
- `SCRIPTORIUM🜇 0.1/.env copy`
- `SCRIPTORIUM🜇 0.1/venv/`
- `SCRIPTORIUM🜇 0.1/.venv/`
- `SCRIPTORIUM🜇 0.1/.tmp.driveupload/`
- `SCRIPTORIUM🜇 0.1/__pycache__/`
- `PUNTO_CERO` outputs `.capcut.json` como fuente canónica
- `PUNTO_CERO` zips de packs como fuente canónica
- `PUNTO_CERO` assets masivos dentro del historial git

### Migrar sólo como legado

- `PUNTO_CERO/SCRIPTORIUM_ARCONTICO/`
- `PUNTO_CERO/arconte/`

Porque:

- contienen valor documental,
- pero no están plenamente integrados al motor ni al canon actual.

## 7. Conflictos que hay que resolver antes de fusionar

### Conflicto 1: dos lenguajes de verdad

- En `0.1`, la verdad vive en Markdown/JSON/glosario.
- En `PUNTO_CERO`, la verdad vive en `.arc`/timeline/export.

Resolución:

- `canon/` define conceptos.
- `arc/` define ejecución.

### Conflicto 2: dos pipelines distintos

- `0.1` produce texto para redes/blog.
- `PUNTO_CERO` produce secuencias audiovisuales.

Resolución:

- mantener ambos como productos de un mismo núcleo semántico,
- no forzar que uno reemplace al otro.

### Conflicto 3: parser fragmentado

- `PUNTO_CERO` tiene más de una ruta de parseo.

Resolución:

- escoger una sola cadena oficial:
  `lexer -> ast -> transform -> runner`

### Conflicto 4: outputs mezclados con fuentes

Resolución:

- todo lo generado vive en `runtime/outputs/`,
- todo lo editable vive fuera de ahí.

## 8. Reglas para el repositorio maestro

### Regla 1

`canon/` nunca ejecuta nada.
Sólo define semántica, textos, glosarios y prompts.

### Regla 2

`engine/` no contiene doctrina editorial.
Sólo runtime, parser, acciones y exportadores.

### Regla 3

`integrations/` es puente hacia servicios externos:

- LLM,
- Notion,
- publicación.

### Regla 4

`runtime/outputs/` jamás se usa como fuente de verdad.

### Regla 5

Assets binarios grandes se gestionan con criterio:

- Git LFS,
- carpeta externa versionada por lotes,
- o snapshots separados.

## 9. Plan de fusión en 4 fases

### Fase A — Higiene mínima

1. Crear repo maestro nuevo.
2. Añadir `.gitignore`.
3. Añadir `.env.example`.
4. Rotar secretos comprometidos.
5. Definir política para assets/binarios.

### Fase B — Canon

1. Migrar manifiesto, ontología, glosarios y prompts desde `0.1`.
2. Extraer material útil de `AGENTS.md`.
3. Archivar lo demás como `legacy`.

### Fase C — Motor

1. Migrar `core/`, `rituales/`, `parser/`, `engine/` desde `PUNTO_CERO`.
2. Unificar parser.
3. Hacer que runner preserve `name`, `steps`, `timeline` y exporte semántica correcta.

### Fase D — Integraciones

1. Integrar `glosario_generator.py`.
2. Integrar sync Notion.
3. Reescribir publicador.
4. Conectar canon editorial con pipelines ARC.

## 10. Prioridad de rescate

Orden recomendado de rescate:

1. `SCRIPTORIUM🜇 0.1/02_GLOSARIOS/glosario_maestro.json`
2. `SCRIPTORIUM🜇 0.1/03_PROMPTS_BASE/prompt_01_generacion_contenido_v2_HIBRIDO.md`
3. `PUNTO_CERO/core/`
4. `PUNTO_CERO/parser/`
5. `PUNTO_CERO/engine/`
6. `PUNTO_CERO/pipelines/reels/`
7. `SCRIPTORIUM🜇 0.1/glosario_generator.py`
8. `SCRIPTORIUM🜇 0.1/scriptorium.py`

## 11. Juicio final

La fusión correcta no es:

- mover `PUNTO_CERO` dentro de `0.1`,
- ni mover `0.1` dentro de `PUNTO_CERO`.

La fusión correcta es construir un tercer repositorio maestro.

### Fórmula de integración

- `PUNTO_CERO` aporta el cuerpo del sistema.
- `SCRIPTORIUM🜇 0.1` aporta la voz del sistema.
- el repositorio maestro debe aportar la disciplina que hoy falta.
