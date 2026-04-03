reel madonna_hibrida_acto4 {

    meta {
        version: "1.0"
        duration: "30s"
        theme: "Madonna Híbrida — Ascensión"
        tono: "híbrido total — místico + profano + tecnognóstico"
    }

    assets {
        img1: "assets/madonna_hibrida/09.jpg"
        img2: "assets/madonna_hibrida/10.jpg"
        img3: "assets/madonna_hibrida/11.jpg"
        img4: "assets/madonna_hibrida/12.jpg"
        audio: "audio/ascension.wav"
    }

    styles {
        font_primary: "Bodoni"
        font_secondary: "HelveticaNeue-Light"
        color_text: "#FFFFFF"
        motion_text: "fade_up"
        transition_images: "crossfade_600ms"
        caption_style: "editorial_minimal_glitch"
    }

    timeline {

        segment 0-4s {
            img: img1
            text: "Ascender no era subir."
        }

        segment 4-9s {
            img: img2
            text: "Era desdoblar la sombra y beber su eco."
        }

        segment 9-15s {
            img: img2
            text: "El código abrió su médula."
        }

        segment 15-20s {
            img: img3
            text: "La carne se volvió señal."
        }

        segment 20-26s {
            img: img4
            text: "La luz dejó de obedecer."
        }

        segment 26-30s {
            img: img4
            text: "Ascensión: donde la forma sueña con su origen."
        }
    }
}
