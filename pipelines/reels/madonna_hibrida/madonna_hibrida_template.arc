reel madonna_hibrida_template {

    meta {
        version: "1.0"
        duration: "30s"
        theme: "Madonna Híbrida — (Título del Acto)"
        tono: "(tono aquí)"
    }

    assets {
        img1: "assets/madonna_hibrida/__01.jpg"
        img2: "assets/madonna_hibrida/__02.jpg"
        img3: "assets/madonna_hibrida/__03.jpg"
        img4: "assets/madonna_hibrida/__04.jpg"
        audio: "audio/__track.wav"
    }

    styles {
        font_primary: "Bodoni"
        font_secondary: "HelveticaNeue-Light"
        color_text: "#FFFFFF"
        motion_text: "fade_up"
        transition_images: "crossfade_600ms"
        caption_style: "editorial_minimal"
    }

    timeline {
        segment 0-4s  { img: img1 text: "(línea 1)" }
        segment 4-9s  { img: img1 text: "(línea 2)" }
        segment 9-15s { img: img2 text: "(línea 3)" }
        segment 15-20s { img: img3 text: "(línea 4)" }
        segment 20-26s { img: img3 text: "(línea 5)" }
        segment 26-30s { img: img4 text: "(línea 6 — cierre)" }
    }
}
