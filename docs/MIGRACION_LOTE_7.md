# Migración Lote 7

Objetivo:

- aprovechar evidencia del pack oficial `madonna_hibrida_pack`,
- sin extender aliases a media no demostrada.

## Evidencia usada

- `pipelines/capcut_pack/madonna_hibrida_pack/assets/01-04.jpg`
- `madonna_hibrida_acto2.capcut.json` referencia `assets/madonna_hibrida/01-04.jpg`

## Acciones

- hidratación del pack oficial bajo `pipelines/capcut_pack/madonna_hibrida_pack/`
- alias con evidencia para `assets/madonna_hibrida/01-04.jpg`
- preservación explícita del límite: no se hidrataron `05-12` ni audios faltantes

## Resultado

- auditoría de referencias: `48` refs únicas
- presentes en origen técnico: `8`
- presentes ya en maestro: `12` físicamente hidratadas, pero sólo `8` corresponden a refs declaradas auditadas
- `pipelines/reels/kerigma_master/acto5.arc` queda cubierto por evidencia de pack
- `pipelines/reels/madonna_hibrida/madonna_hibrida_acto2.arc` sube a cobertura parcial `4/5`

## Límite técnico

La cobertura parcial de `madonna_hibrida_acto2.arc` deja visible una ausencia real:

- `audio/antes_del_silencio_cantos_de_ballena.wav`
