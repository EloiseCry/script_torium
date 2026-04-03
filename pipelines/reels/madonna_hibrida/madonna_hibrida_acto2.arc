reel madonna_hibrida_acto2 {

    meta {
        version: "1.0"
        duration: "30s"
        theme: "Madonna Híbrida — Divina/Profana"
        tono: "poético, editorial, neoexpresionista"
    }

    assets {
        img1: "assets/madonna_hibrida/01.jpg"
        img2: "assets/madonna_hibrida/02.jpg"
        img3: "assets/madonna_hibrida/03.jpg"
        img4: "assets/madonna_hibrida/04.jpg"
        audio: "audio/antes_del_silencio_cantos_de_ballena.wav"
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

    segment 0-3s {
        img: img1
        text: "Ella no vino a ser vista."
    }

    segment 3-7s {
        img: img1
        text: "Ella vino a resonar."
    }

    segment 7-12s {
        img: img2
        text: "Entre lo divino…"
    }

    segment 12-17s {
        img: img2
        text: "…y lo profano."
    }

    segment 17-22s {
        img: img3
        text: "Cuerpo antiguo."
    }

    segment 22-26s {
        img: img3
        text: "Tecnología que respira."
    }

    segment 26-30s {
        img: img4
        text: "Madonna Híbrida: la liturgia que arde."
    }

    }

}
