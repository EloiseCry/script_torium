reel kerigma_silencio_arconte_acto0 {

    meta {
        version = "1.0"
        acto = "0"
        titulo = "La Cámara del Primer Latido"
        duracion = "30s"
        tono = "umbilical, primordial, subterráneo, mineral"
        audio = "audio/silencio_arconte.wav"
    }

    assets {
        img1 = "assets/arconte/00.jpg"
        img2 = "assets/arconte/01.jpg"
        img3 = "assets/arconte/02.jpg"
        img4 = "assets/arconte/03.jpg"
    }

    timeline {

        // 0–4s
        range 0-4 {
            img = img1
            text = "Antes del nombre, hubo un pulso."
        }

        // 4–9s
        range 4-9 {
            img = img1
            text = "El silencio abrió un ojo sin abrirse."
        }

        // 9–15s
        range 9-15 {
            img = img2
            text = "La primera vibración golpeó la piedra."
        }

        // 15–21s
        range 15-21 {
            img = img3
            text = "Nadie escuchó… excepto la sombra."
        }

        // 21–27s
        range 21-27 {
            img = img3
            text = "Y la sombra respondió con un resplandor."
        }

        // 27–30s — prólogo
        range 27-30 {
            img = img4
            text = "Acto 0: La Cámara del Primer Latido."
        }
    }

    styles {
        font_primary = "Bodoni"
        font_secondary = "HelveticaNeue-Light"
        color_text = "#FFFFFF"
        motion_text = "fade_up_600"
        transition_images = "crossfade_900"
        caption_style = "editorial_primordial"
    }
}
