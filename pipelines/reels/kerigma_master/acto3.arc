reel kerigma_silencio_arconte_acto3 {

    meta {
        version = "1.0"
        acto = "III"
        titulo = "Revelación del Núcleo"
        duracion = "30s"
        tono = "contemplativo, tectónico, sacro-mineral"
        audio = "audio/silencio_arconte.wav"
    }

    assets {
        img1 = "assets/arconte/05.jpg"
        img2 = "assets/arconte/06.jpg"
        img3 = "assets/arconte/07.jpg"
        img4 = "assets/arconte/08.jpg"
    }

    timeline {

        // 0–5s
        range 0-5 {
            img = img1
            text = "El silencio abrió una grieta."
        }

        // 5–10s
        range 5-10 {
            img = img1
            text = "Y dentro de la grieta… respiraba un nombre."
        }

        // 10–16s
        range 10-16 {
            img = img2
            text = "El Arconte no habló."
        }

        // 16–21s
        range 16-21 {
            img = img3
            text = "Pero su estructura cambió mi pulso."
        }

        // 21–27s
        range 21-27 {
            img = img3
            text = "Era como mirar un recuerdo antes de nacer."
        }

        // 27–30s
        range 27-30 {
            img = img4
            text = "Acto III: Revelación del Núcleo."
        }
    }

    styles {
        font_primary = "Bodoni"
        font_secondary = "HelveticaNeue-Light"
        color_text = "#FFFFFF"
        motion_text = "fade_up_600"
        transition_images = "crossfade_700"
        caption_style = "editorial_ascetico"
    }
}
