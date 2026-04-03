reel madonna_hibrida_acto3 {

    meta {
        version: "1.0"
        duration: "30s"
        theme: "Madonna Híbrida — Transfiguración"
        tono: "ascético, radiante, místico-material"
    }

    assets {
        img1: "assets/madonna_hibrida/05.jpg"
        img2: "assets/madonna_hibrida/06.jpg"
        img3: "assets/madonna_hibrida/07.jpg"
        img4: "assets/madonna_hibrida/08.jpg"
        audio: "audio/transfiguracion.wav"
    }

    styles {
        font_primary: "Bodoni"
        font_secondary: "HelveticaNeue-Light"
        color_text: "#FFFFFF"
        motion_text: "fade_up"
        transition_images: "crossfade_700ms"
        caption_style: "editorial_minimal"
    }

    timeline {

        segment 0-4s {
            img: img1
            text: "La carne empezó a recordar su luz."
        }

        segment 4-9s {
            img: img1
            text: "Un rumor antiguo abrió su arquitectura."
        }

        segment 9-15s {
            img: img2
            text: "El hueso se volvió mensaje."
        }

        segment 15-20s {
            img: img3
            text: "La piel, una plegaria en tránsito."
        }

        segment 20-26s {
            img: img3
            text: "La forma ya no era su límite."
        }

        segment 26-30s {
            img: img4
            text: "Transfiguración: el instante donde nada es lo que fue."
        }

    }

}
