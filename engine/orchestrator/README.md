# Orchestrator Contract

`engine/orchestrator/` define la capa de decision del sistema. No genera contenido y no reemplaza al runner. Su trabajo es decidir que accion ejecutar segun el estado operativo.

## Componentes

- `orchestrator.js`: logica de decision y ejecucion de acciones.
- `observer.js`: actualiza estado operativo desde eventos externos.
- `decision_table.json`: reglas de modo.
- `state.seed.json`: snapshot canonic para bootstrap.
- `state_store.js`: acceso unificado al estado runtime.

## Regla de oro aplicada

- `engine/` guarda logica y contratos.
- `runtime/` guarda estado mutable y efectos.

Por eso el estado vivo se guarda en `runtime/orchestrator/state.json`.

## Flujo permitido

- `Orchestrator -> Runner -> Runtime`
- `Observer -> Runtime`

## Flujo prohibido

- `Observer -> Orchestrator`

El observer no decide acciones; solo registra hechos.

## Ejecucion

- CLI: `npm run orchestrate`
- Import seguro: importar `runOrchestrator` no ejecuta efectos automaticamente.

## Estado minimo esperado

- `template_actual` o `template_path`
- `estado_media` (`presente`, `faltante`)
- `ciclope.capas_pendientes`
- `saturacion`
