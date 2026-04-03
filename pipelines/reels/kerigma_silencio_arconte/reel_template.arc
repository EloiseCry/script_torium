reel kerigma {
    meta {
        version: "1.0"
        acto: "1"
        duration: "30s"
        theme: "Silencio del Arconte — Acto Ritual"
    }

    assets {
        img1: "assets/arconte/01.jpg"
        img2: "assets/arconte/02.jpg"
        img3: "assets/arconte/03.jpg"
        img4: "assets/arconte/04.jpg"
        audio_main: "audio/silencio_arconte.wav"
    }

    timeline {
        clip {
            img: "img1"
            text: "Apertura del eco."
            start: 0
            duration: 4000
        }

        clip {
            img: "img2"
            text: "La voz que aún no llega."
            start: 4000
            duration: 4000
        }

        clip {
            img: "img3"
            text: "Lo que respira detrás del hueso."
            start: 8000
            duration: 4000
        }
    }

    styles {
        font: "Bodoni"
        text_color: "#FFFFFF"
        motion: "fade_up"
        transition: "crossfade_600ms"
    }
}
