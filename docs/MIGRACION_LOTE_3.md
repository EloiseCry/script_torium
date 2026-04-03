# Migración Lote 3

Objetivo:

- traer un primer pipeline real y ejecutable al repositorio maestro,
- validar el runner contra material heredado no sintético.

## Pipeline migrado

- `pipelines/reels/madonna_hibrida/`

## Archivos incluidos

- `madonna_hibrida_master.arc`
- `madonna_hibrida.arc`
- `madonna_hibrida_acto2.arc`
- `madonna_hibrida_acto3.arc`
- `madonna_hibrida_acto4.arc`
- `madonna_hibrida_template.arc`

## Verificación

El runner maestro ya ejecuta `madonna_hibrida_master.arc` con referencias de secuencia
en estilo proyecto (`pipelines/reels/...`) y produce una línea de tiempo consolidada
de 90 segundos.

También ejecuta `madonna_hibrida.arc`, que usa la variante más rica con
`track video/texto/audio`, `escena`, `caption` y `layer`.

## Hallazgo conservado

Los actos heredados referencian `assets/madonna_hibrida/...`, pero el árbol fuente
visible usa `assets/madonna/...`. Esa inconsistencia se conserva y se documenta;
no se corrige todavía para no reescribir la memoria técnica del proyecto.

## No migrado todavía

- outputs `.capcut.json` históricos
- assets binarios
- audio binario
