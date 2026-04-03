#tipo: glosario
#dominio: programacion
#version: 1.0
#descripcion: >
  Glosario técnico del SCRIPTORIUM ARCONTICO.
  Define conceptos, estructuras y términos usados por el parser,
  el engine y los módulos operativos.

###########################################################
## 1. ESTRUCTURA DE LENGUAJE Y PARSER
###########################################################

entrada:
  termino: "Token"
  tipo: estructura
  descripcion: "Unidad mínima reconocible por el lexer."
  relaciones: ["Lexer", "Sintaxis ARC"]

entrada:
  termino: "Lexer"
  tipo: componente
  descripcion: "Módulo que convierte texto ARC en tokens."
  relaciones: ["Parser"]

entrada:
  termino: "Parser"
  tipo: componente
  descripcion: "Interpreta tokens y construye un árbol sintáctico (AST)."
  relaciones: ["AST", "Sintaxis ARC"]

entrada:
  termino: "AST"
  tipo: estructura
  descripcion: "Árbol sintáctico que representa la estructura interna del archivo ARC."
  relaciones: ["Parser", "Transformador"]

entrada:
  termino: "Transformador"
  tipo: componente
  descripcion: >
    Módulo que convierte el AST en acciones,
    estructuras operativas o entidades internas.
  relaciones: ["Engine"]

###########################################################
## 2. ELEMENTOS OPERATIVOS
###########################################################

entrada:
  termino: "Módulo"
  tipo: componente
  descripcion: "Unidad funcional del sistema; puede contener archivos, lógica y conexiones."
  relaciones: ["Archivo"]

entrada:
  termino: "Acción"
  tipo: estructura
  descripcion: "Resultado final de interpretar un archivo ARC."
  relaciones: ["Engine"]

entrada:
  termino: "Engine"
  tipo: componente
  descripcion: "Motor lógico que ejecuta acciones generadas por el parser."
  relaciones: ["Prompts", "Ritual"]

entrada:
  termino: "Runner"
  tipo: componente
  descripcion: "Controlador de flujo general del sistema."
  relaciones: ["Engine"]

###########################################################
## 3. ESTRUCTURA DE ARCHIVOS Y SINTAXIS
###########################################################

entrada:
  termino: "Clave ARC"
  tipo: estructura
  descripcion: "Identificador precedido por nombre, dos puntos y valor indentado."
  ejemplo: |
    entrada:
      termino: "algo"

entrada:
  termino: "Archivo ARC"
  tipo: estructura
  descripcion: "Documento con sintaxis declarativa usada por el Scriptorium."
  relaciones: ["Sintaxis ARC", "Parser"]

entrada:
  termino: "Sintaxis ARC"
  tipo: regla
  descripcion: "Conjunto de reglas formales para escribir archivos .arc."
  relaciones: ["Parser", "Lexer"]

###########################################################
## 4. PROCESOS
###########################################################

entrada:
  termino: "Validación"
  tipo: proceso
  descripcion: "Verificación estructural y semántica del contenido ARC."
  relaciones: ["Parser", "Engine"]

entrada:
  termino: "Resolución"
  tipo: proceso
  descripcion: "Conversión de estructura semántica en acción ejecutable."
  relaciones: ["Engine"]
