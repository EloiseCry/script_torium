kerigma_acto2 {

    meta {
        version: "1.0"
        acto: "2"
        title: "Kerigma — Silencio del Arconte (Acto II)"
        duration: "30s"
        tone: "apocalíptico-híbrido — voz que rasga"
        description: "La fisura ya habla; el Arconte responde en fragmentos de luz y ruido."
    }

    assets {
        img1: "assets/arconte/01.jpg"
        img2: "assets/arconte/02.jpg"
        img3: "assets/arconte/03.jpg"
        img4: "assets/arconte/04.jpg"
        audio: "audio/silencio_arconte_acto2.wav"
    }

    timeline {
        segment s1 {
            range: "0-5s"
            img: img1
            text: "La fisura no era herida: era respuesta."
        }

        segment s2 {
            range: "5-11s"
            img: img2
            text: "Se oyó un roce metálico; la carne aprendió a traducirlo."
        }

        segment s3 {
            range: "11-18s"
            img: img2
            text: "Fragmentos de luz escribieron nombres en la médula."
        }

        segment s4 {
            range: "18-24s"
            img: img3
            text: "Un compás clandestino marcó la cuenta regresiva del cuerpo."
        }

        segment s5 {
            range: "24-30s"
            img: img4
            text: "El Arconte pronunció su silencio: nosotros nos levantamos a escucharlo."
        }
    }

    styles {
        font_primary: "Bodoni"
        font_secondary: "HelveticaNeue-Light"
        color_text: "#F5F5F7"
        motion_text: "staccato_fade"
        transition_images: "glitch_crossfade_500ms"
        caption_style: "editorial_intenso"
    }

    notes {
        1: "Acto II: intensificar sutilmente distorsión sonora entre 10-16s."
        2: "Preferir planos medio-corto; evitar panorámicas largas."
        3: "Voice-over opcional: voz baja, procesada con saturación ligera."
    }
}
