reel kerigma_silencio_arconte_acto4 {

    meta {
        version = "1.0"
        acto = "IV"
        titulo = "Ascenso del Arconte"
        duracion = "30s"
        tono = "ascensional, hierático, ingrávido, tectónico"
        audio = "audio/silencio_arconte.wav"
    }

    assets {
        img1 = "assets/arconte/09.jpg"
        img2 = "assets/arconte/10.jpg"
        img3 = "assets/arconte/11.jpg"
        img4 = "assets/arconte/12.jpg"
    }

    timeline {

        // 0–4s
        range 0-4 {
            img = img1
            text = "El silencio dejó de ser un límite."
        }

        // 4–9s
        range 4-9 {
            img = img1
            text = "Comenzó a levantarse como una torre."
        }

        // 9–15s
        range 9-15 {
            img = img2
            text = "El Arconte ascendía sin mover un cuerpo."
        }

        // 15–21s
        range 15-21 {
            img = img3
            text = "Sólo su geometría cambiaba de densidad."
        }

        // 21–27s
        range 21-27 {
            img = img3
            text = "Y su sombra se volvió una luz sin origen."
        }

        // 27–30s — cierre
        range 27-30 {
            img = img4
            text = "Acto IV: Ascenso del Arconte."
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
