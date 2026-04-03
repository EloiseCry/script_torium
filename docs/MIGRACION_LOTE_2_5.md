# Migración Lote 2.5

Objetivo:

- reactivar ejecución ARC real sobre el parser unificado,
- sin reintroducir el acoplamiento roto del runner heredado.

## Incluye

- `engine/actions/arc_actions.js`
- `engine/runner/index.js`
- `tests/runner_smoke_check.mjs`
- extensión del parser para `secuencia` e `incluye`

## Resultado

El repositorio maestro ya puede:

- ejecutar rituales `steps`,
- materializar rituales `timeline`,
- orquestar maestros `sequence` y `secuencia` con inclusión secuencial de actos,
- exportar la línea de tiempo resultante a CapCut desde el runner nuevo.

## Criterio

No se migró el runner antiguo; se sustituyó por una implementación mínima y estable
alineada al contrato actual del parser.
