# Gobernanza de Publicacion (main)

Fecha: 2026-04-08

## Objetivo

Blindar `main` para que solo entre codigo verificado y coherente con la Regla de Oro.

## Configuracion recomendada de Branch Protection

Aplicar en GitHub para la rama `main`:

1. Require a pull request before merging: ON
2. Require approvals: 1 minimo
3. Dismiss stale approvals when new commits are pushed: ON
4. Require review from Code Owners: ON
5. Require status checks to pass before merging: ON
6. Checks requeridos:
- `test` (workflow `.github/workflows/test.yml`)
7. Require conversation resolution before merging: ON
8. Restrict force pushes: ON
9. Restrict deletions: ON
10. Require linear history: ON (recomendado)

## Politica de merge

- Merge strategy recomendada: Squash
- Prohibir merge directo a `main` excepto emergencia auditada

## Gate local antes de abrir PR

Ejecutar:

```powershell
npm run health:check
```

## Criterio de rechazo inmediato

- Cualquier archivo mutable dentro de `engine/` que no sea contrato/logica
- Cualquier output efimero en `runtime/` agregado al indice git
- Cambios de Orchestrator sin prueba de decision (`test:orchestrator`)

## Evidencia minima por PR

- comando(s) ejecutados
- resultado de tests
- riesgo principal identificado
- rollback definido
