# Migración Lote 1

Objetivo:

- establecer base limpia,
- rescatar la memoria forense,
- migrar el canon editorial seguro,
- evitar binarios, caches y secretos.

## Incluye

### Base de repositorio

- `README.md`
- `.gitignore`
- `.env.example`
- `docs/ARQUITECTURA_REPO.md`
- este archivo

### Auditorías

- auditoría de `SCRIPTORIUM🜇 0.1`
- auditoría de `scriptorium-arcontico punto cero`
- comparativa entre ambas
- matriz de fusión

### Memoria histórica

- `1.txt` a `6.txt` en `logs/origen/`

### Canon editorial seguro

- manifiesto
- ontología
- glosarios editoriales
- glosario maestro JSON
- prompts base híbridos
- movimientos y experimentos textuales

## No incluye todavía

- secretos
- `.env`
- `venv/` o `.venv/`
- binarios pesados
- audio
- packs zip
- `.capcut.json`
- caches
- scripts Python/Node con contratos rotos sin refactor previo

## Lote 2 sugerido

- `arc/core/`
- `arc/rituales/`
- `engine/exporters/`
- `engine/preexport/`
- parser unificado

## Lote 3 sugerido

- `integrations/llm/`
- `integrations/notion/`
- `integrations/publishing/`

## Riesgo principal

No arrastrar al repo maestro las incoherencias de contrato entre parser, runner y outputs.
