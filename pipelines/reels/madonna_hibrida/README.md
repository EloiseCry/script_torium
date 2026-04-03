# Madonna Hibrida

Primer bloque real migrado desde `scriptorium-arcontico punto cero`.

## Incluye

- `madonna_hibrida.arc`
- `madonna_hibrida_master.arc`
- `madonna_hibrida_acto2.arc`
- `madonna_hibrida_acto3.arc`
- `madonna_hibrida_acto4.arc`
- `madonna_hibrida_template.arc`

## Estado

Estos actos ya son ejecutables con el runner nuevo porque usan el dialecto
`timeline` simplificado.

`madonna_hibrida.arc` también quedó ejecutable: ya se soporta la variante de
`track video/texto/audio` con `escena`, `caption` y `layer`.

## Nota de herencia

Las rutas de assets de estos actos apuntan a `assets/madonna_hibrida/...`,
pero en el repositorio fuente los archivos visibles están bajo `assets/madonna/...`.
La migración preserva esa inconsistencia para no falsificar el origen; se resolverá
en una fase de saneamiento de assets.

## Nota técnica

La exportación todavía conserva estilos agregados a nivel de ritual más el estilo
concreto de cada caption. Es suficiente para trazabilidad, no todavía para una
semántica visual final de producción.
