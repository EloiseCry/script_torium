# Kerigma Master

Actos fuente usados por `kerigma_silencio_arconte_master.arc`.

## Incluye

- `acto0.arc`
- `acto1.arc`
- `acto2.arc`
- `acto3.arc`
- `acto4.arc`
- `acto5.arc`
- `acto6.arc`

## Estado

El runner maestro ya ejecuta `acto0`, `acto2`, `acto3`, `acto4` y `acto5`.

## Particularidades

- `acto1.arc` está vacío en el origen y se conserva así.
- `acto5.arc` usa acciones inline dentro de `timeline`; este caso ya quedó soportado.
- `acto6.arc` existe en el origen pero no es referenciado por el master actual.
- la declaración de audio es inconsistente: algunos actos usan `meta.audio` y otros `assets.audio`
- el runner maestro ya respeta `meta.duracion` cuando existe; por eso el master consolidado ocupa 150s
