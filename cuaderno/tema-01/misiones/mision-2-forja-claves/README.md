# Mision 2 · La forja de claves 🔐

Nivel 2 · IA como pair · 60-90 min

## Objetivo

Generador de contrasenas con longitud y materiales configurables (letras, cifras, simbolos).

**Practicas:** funciones con parametros, bucles, strings e indexacion, booleanos, checkboxes, `classList`.

## Fases

1. **La receta:** `forjarClave(longitud, usarNumeros, usarSimbolos)` -> string. Funcion pura: no toca el DOM.
2. **El alfabeto:** letras + `"0123456789"` + `"!@#$%&*?"` segun los booleanos.
3. **El martillo aleatorio:** `Math.floor(Math.random() * alfabeto.length)`.
4. **La entrega:** boton -> `Number()`, `.checked`, mostrar en `#clave`.
5. **Control de calidad:** longitud fuera de 4-32 -> aviso.

## Criterios de aceptacion

- [ ] `forjarClave` es pura y devuelve siempre un string.
- [ ] La clave tiene exactamente la longitud pedida.
- [ ] Sin casillas marcadas, solo letras.
- [ ] Cada pulsacion genera una clave distinta.
- [ ] Longitud fuera de rango: aviso y sin clave.

## Retos extra

- [ ] Medidor de temple (debil / aceptable / legendaria) con `classList` (logro "Clave legendaria").
- [ ] Garantizar un caracter de cada grupo.
- [ ] Historial de las 3 ultimas claves.
