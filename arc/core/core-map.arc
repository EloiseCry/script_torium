#tipo: mapa
#dominio: core
#version: 1.0
#descripcion: >
  Mapa maestro del CORE del Scriptorium Arcontico.
  Define la estructura, relaciones y orden de carga de los módulos
  fundamentales: glosarios, ontología, manifiesto, rituales y
  colección principal de prompts.

###########################################################
## 1. MÓDULOS PRINCIPALES
###########################################################

modulos:
  glosario_conciencia:
    archivo: "glosario_conciencia.arc"
    tipo: glosario
    rol: "semántica híbrida (conciencia, reflexión, identidad simbólica)"
  
  glosario_programacion:
    archivo: "glosario_programacion.arc"
    tipo: glosario
    rol: "semántica técnica (programación, entorno, estructura operativa)"
  
  manifesto:
    archivo: "manifesto.arc"
    tipo: manifiesto
    rol: "identidad del sistema y principios del arconte"

  ontology:
    archivo: "ontology.arc"
    tipo: ontologia
    rol: "definición de conceptos, relaciones, estructuras y taxonomías"

  ritual_base:
    archivo: "ritual.arc"
    tipo: ritual
    rol: "núcleo conceptual del Prompt Ritual"

  prompts_core:
    archivo: "prompts-core.arc"
    tipo: prompts
    rol: "operadores básicos del agente; funciones técnicas y rituales"

###########################################################
## 2. RELACIONES ENTRE MÓDULOS
###########################################################

relaciones:

  - desde: manifesto
    hacia: ontology
    relacion: "define principios que determinan relaciones ontológicas"

  - desde: manifesto
    hacia: ritual_base
    relacion: "provee la identidad simbólica del ritual"

  - desde: glosario_conciencia
    hacia: ontology
    relacion: "alimenta conceptos abstractos y entidades híbridas"

  - desde: glosario_programacion
    hacia: prompts_core
    relacion: "define vocabulario operativo para prompts funcionales"

  - desde: ontology
    hacia: ritual_base
    relacion: "el ritual se basa en entidades definidas en la ontología"

  - desde: prompts_core
    hacia: ritual_base
    relacion: "activa, interpreta y ejecuta el ritual"

  - desde: ritual_base
    hacia: prompts_core
    relacion: "expande el comportamiento del agente"

###########################################################
## 3. ORDEN DE CARGA DEL CORE
###########################################################

orden_carga:
  - manifesto         # Identidad primero
  - glosario_conciencia
  - glosario_programacion
  - ontology          # Mapa mental del sistema
  - prompts_core      # Operadores del agente
  - ritual_base       # Ritual final (requiere todo lo anterior)

###########################################################
## 4. VALIDACIÓN Y CONSISTENCIA
###########################################################

validacion:
  glosarios:
    requiere:
      - "glosario_conciencia.arc"
      - "glosario_programacion.arc"

  ontology:
    requiere: "ontology.arc"
    valida_relaciones: true

  ritual:
    requiere:
      - "manifesto.arc"
      - "ontology.arc"
      - "prompts-core.arc"

  prompts:
    verifica_sintaxis: true
    verifica_coherencia: true

###########################################################
## 5. EXTENSIÓN FUTURA
###########################################################

extension:
  descripcion: >
    Para agregar nuevos módulos al CORE, deben declararse aquí con:
    - archivo
    - tipo
    - rol
    - relación con los módulos existentes

  ejemplo:
    archivo: "nuevo_modulo.arc"
    tipo: auxiliar
    rol: "extensión experimental"
    relacion_con:
      - ontology
      - prompts_core
pack madonna_hibrida {
    zip: "pipelines/capcut_pack/madonna_hibrida_pack.zip"
    installs_to: "pipelines/reels/madonna_hibrida/"
}
