# Manifiesto de Reemplazo de Placeholders

## Resumen

- Sets declarados: 1
- Placeholders declarados: 5
- Con preview candidate: 5
- Con preview candidate existente: 5

## madonna_hibrida_template

- familia: madonna_hibrida
- pipeline: pipelines/reels/madonna_hibrida/madonna_hibrida_template.arc
- notas: Plantilla generica de acto para Madonna Hibrida. Los placeholders no deben contarse como media final.
- `assets/madonna_hibrida/__01.jpg`
  slot: visual_1
  tipo: image
  rol: hero_opening
  patrones admitidos: assets/madonna_hibrida/*.jpg
  preview candidate: assets/madonna_hibrida/01.jpg
  preview candidate existe: si
  preview generator: n/a
- `assets/madonna_hibrida/__02.jpg`
  slot: visual_2
  tipo: image
  rol: hero_mid_1
  patrones admitidos: assets/madonna_hibrida/*.jpg
  preview candidate: assets/madonna_hibrida/02.jpg
  preview candidate existe: si
  preview generator: n/a
- `assets/madonna_hibrida/__03.jpg`
  slot: visual_3
  tipo: image
  rol: hero_mid_2
  patrones admitidos: assets/madonna_hibrida/*.jpg
  preview candidate: assets/madonna_hibrida/03.jpg
  preview candidate existe: si
  preview generator: n/a
- `assets/madonna_hibrida/__04.jpg`
  slot: visual_4
  tipo: image
  rol: hero_closing
  patrones admitidos: assets/madonna_hibrida/*.jpg
  preview candidate: assets/madonna_hibrida/04.jpg
  preview candidate existe: si
  preview generator: n/a
- `audio/__track.wav`
  slot: audio_main
  tipo: audio
  rol: score_or_ambience
  patrones admitidos: audio/*.wav
  preview candidate: runtime/previews/media/madonna_hibrida_template.audio_main.preview.wav
  preview candidate existe: si
  preview generator: silence_wav_30s
