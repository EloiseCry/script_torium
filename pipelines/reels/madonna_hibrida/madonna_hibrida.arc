reel MadonnaHibrida {

    meta {
        version: "1.0"
        tipo: "reel_template"
        duracion: 30s
        ratio: "9:16"
        fps: 30
        descripcion: "Plantilla audiovisual del Reel #1 — Madonna Híbrida"
    }

    require {
        core/ritual.arc
        core/ontology.arc
    }

    assets {
        imagenes {
            frame_01: "assets/madonna/frame_01.jpg"
            frame_02: "assets/madonna/frame_02.jpg"
            frame_03: "assets/madonna/frame_03.jpg"
            frame_04: "assets/madonna/frame_04.jpg"
            frame_05: "assets/madonna/frame_05.jpg"
            frame_06: "assets/madonna/frame_06.jpg"
            frame_07: "assets/madonna/frame_07.jpg"
            final_frame: "assets/madonna/final_frame.jpg"
        }

        audio {
            voice_over: "audio/vo_madonna_hibrida.wav"
            musica: "audio/score_madonna_hibrida.wav"
        }
    }

    timeline {

        track video {

            escena 01 {
                src: imagenes.frame_01
                start: 0s
                duracion: 2s
                transicion: fade_in_white
                zoom: 0
            }

            escena 02 {
                src: imagenes.frame_02
                start: 2s
                duracion: 4s
                transicion: hard_cut
                zoom: +0.05
            }

            escena 03 {
                src: imagenes.frame_03
                start: 6s
                duracion: 4s
                transicion: glitch_1f
            }

            escena 04 {
                src: imagenes.frame_04
                start: 10s
                duracion: 4s
                transicion: crossfade
            }

            escena 05 {
                src: imagenes.frame_05
                start: 14s
                duracion: 4s
                transicion: slow_zoom_out
                zoom: -0.05
            }

            escena 06 {
                src: imagenes.frame_06
                start: 18s
                duracion: 4s
                transicion: fade_dark
            }

            escena 07 {
                src: imagenes.frame_07
                start: 22s
                duracion: 4s
                transicion: rustle_glitch
            }

            escena 08 {
                src: imagenes.final_frame
                start: 26s
                duracion: 4s
                transicion: fade_out_black
            }
        }

        track texto {

            caption a { start: 0s  duracion: 2s  style: serif_sagrado  contenido: "Lo humano… no terminó." }
            caption b { start: 2s  duracion: 4s  style: serif_sagrado  contenido: "Solo cambió de piel." }
            caption c { start: 6s  duracion: 4s  style: serif_sagrado  contenido: "Divina y defectuosa." }
            caption d { start: 10s duracion: 4s  style: serif_sagrado  contenido: "Carne ritual. Máquina consciente." }
            caption e { start: 14s duracion: 4s  style: serif_sagrado  contenido: "Ella no evoluciona… se desdobla." }
            caption f { start: 18s duracion: 4s  style: sans_minimal   contenido: "Madonna Híbrida." }
            caption g { start: 22s duracion: 4s  style: serif_sagrado  contenido: "Entre lo sagrado… y lo roto." }
            caption h { start: 26s duracion: 4s  style: branding      contenido: "REFLEJOS HÍBRIDOS\nNuevo capítulo" }
        }

        track audio {
            layer voice_over { src: audio.voice_over start: 0s }
            layer musica     { src: audio.musica     start: 0s volumen: 0.85 }
        }
    }

    styles {
        serif_sagrado {
            font: "Cormorant"
            size: 54
            color: "#FFFFFF"
            shadow: soft
        }

        sans_minimal {
            font: "Inter"
            size: 56
            color: "#E0E0E0"
            tracking: 2
        }

        branding {
            font: "EB Garamond"
            size: 60
            color: "#FFFFFF"
            lineHeight: 1.2
        }

        transitions {
            fade_in_white  { type: fade color: "#FFFFFF" duracion: 0.4s }
            hard_cut       { type: cut }
            glitch_1f      { type: glitch intensidad: 0.1 frames: 1 }
            crossfade      { type: crossfade duracion: 0.5s }
            slow_zoom_out  { type: zoom amount: -0.05 duracion: 4s }
            fade_dark      { type: fade color: "#0A0A12" duracion: 0.6s }
            rustle_glitch  { type: texture_glitch intensidad: 0.2 }
            fade_out_black { type: fade color: "#000000" duracion: 1s }
        }
    }
}
