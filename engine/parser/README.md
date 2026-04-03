# Parser ARC

Este directorio contiene el parser unificado del repositorio maestro.

## Objetivo

Exponer un contrato único para los dialectos ARC que hoy existen en el ecosistema:

- rituales por `step { ... }`,
- reels/rituales con `timeline { ... }`,
- secuencias con `sequence { act ... }`.

## Contrato normalizado

Toda llamada a `parseArc()` devuelve un objeto con esta forma base:

```js
{
  type: "ritual",
  dialect: "steps" | "timeline" | "sequence" | "unknown",
  name: string,
  filePath: string | null,
  meta: object,
  assets: object,
  styles: object,
  requires: string[],
  steps: Array<{ name, actions }>,
  timeline: Array<{ start, end, duration, props }>,
  sequence: Array<{ name, props }>,
  rawTree: object
}
```

## Regla

El runner y los exportadores no deben depender de árboles intermedios incompatibles como:

- `sections`
- `phases`
- `entries`

Si se necesitan, se consumen desde `rawTree`, no como contrato principal.
