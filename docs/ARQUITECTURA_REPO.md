# Arquitectura del Repositorio Maestro

## Capas

### `canon/`

Material humano-legible y semántico:

- manifiesto,
- ontología,
- glosarios,
- prompts,
- agentes,
- experimentos editoriales.

### `arc/`

Fuente declarativa del universo ARC:

- módulos `core`,
- rituales base.

### `engine/`

Runtime del sistema:

- parser,
- transform,
- runner,
- acciones,
- exportadores,
- preexport.

### `integrations/`

Conectores externos:

- LLM,
- Notion,
- publicación.

### `pipelines/`

Fuentes de ejecución:

- reels,
- stories,
- feed,
- carruseles,
- weekly.

### `assets/`

Material fuente pesado o curado.

No debe contaminar el núcleo del repositorio con outputs accidentales.

### `runtime/`

Estado derivado:

- caché,
- outputs,
- temporales.

## Reglas

1. `canon/` no contiene secretos ni outputs.
2. `engine/` no contiene doctrina editorial extensa.
3. `runtime/` nunca es fuente de verdad.
4. Los assets pesados se migran de forma controlada.
5. Cualquier parser nuevo debe ajustarse al mismo contrato de AST.
