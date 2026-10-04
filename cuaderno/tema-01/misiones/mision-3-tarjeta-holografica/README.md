# Mision 3 · La tarjeta holografica 🪪

Nivel 2 · IA como pair · 60-90 min

## Objetivo

Tarjeta de presentacion que reacciona a eventos, cambia de tema y esconde un secreto.

**Practicas:** `mouseover`/`mouseout`/`input`/`keydown`, `classList`, arrays y un closure de verdad.

## Fases

1. **Holografia:** `mouseover` anade brillo, `mouseout` la quita.
2. **Edicion en vivo:** `input` actualiza `#nombre`; vacio -> "Tu nombre".
3. **El alternador (closure):** `crearAlternador(temas)` devuelve una funcion que da el siguiente tema y vuelve al principio (`%`). El indice es privado.
4. **Conectar el boton:** quitar la clase del tema actual, poner la nueva.
5. **El secreto:** `keydown` en `document`, tecla `h` -> lema "✨ Modo holograma desbloqueado".

## Criterios de aceptacion

- [x] Brilla al entrar el raton y deja de brillar al salir.
- [x] El nombre se actualiza tecla a tecla; vacio -> texto por defecto.
- [x] `crearAlternador` usa un closure: el indice no es global.
- [x] Dos alternadores con arrays distintos son independientes.
- [x] El ciclo de temas es infinito.
- [x] La tecla `h` desbloquea el secreto.

## Retos extra

- [x] Contador de visitas holograficas.
- [x] `ArrowRight` reutiliza el alternador.
- [x] `dblclick` alterna el lema.

## Uso de IA

Mision resuelta por Claude (Anthropic) a peticion mia, para tenerla de referencia, aunque la mision planteaba la IA solo como companero (pistas y criticas). La he revisado despues.
