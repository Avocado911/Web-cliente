# Mision 1 · El oraculo de los numeros 🔮

Nivel 2 · IA como pair · 60-90 min

## Objetivo

El juego "Adivina el numero" (1-100) completo en el navegador.

**Practicas:** `const`/`let`, `Number()` y `===`, condicionales, template literals, `querySelector`, `textContent`, evento `click`.

Punto de partida (el oraculo elige su numero secreto):

```js
const secreto = Math.floor(Math.random() * 100) + 1;
console.log("(psst... el secreto es", secreto, ")");
```

## Fases

1. **Conexion:** `app.js` carga con `defer`; selecciona input, boton y parrafos.
2. **Primera consulta:** click -> lee el valor, `Number()`, muestralo.
3. **El oraculo responde:** mayor / menor / correcto; valor vacio o fuera de 1-100 -> aviso sin gastar intento.
4. **El marcador:** `let intentos` visible en pantalla.
5. **Fin de partida:** al acertar, `boton.disabled = true`.

## Criterios de aceptacion

- [ ] El script se carga con `defer` y no hay errores en consola.
- [ ] Vacio o fuera de rango: aviso y no incrementa intentos.
- [ ] Pistas mayor/menor correctas en todos los casos.
- [ ] El contador se actualiza en cada consulta valida.
- [ ] Al acertar: mensaje con los intentos y boton desactivado.
- [ ] Ningun `console.log` con el secreto en la version final.

## Retos extra

- [ ] Limite de 7 intentos: el oraculo revela el numero y bloquea el boton (logro "Francotirador").
- [ ] Boton "Nueva profecia" que reinicia la partida.
- [ ] Historial de intentos en un array: `Has probado: 50, 75, 62`.

> Semaforo 🟡: pidele a la IA criticas y pistas ("¿por que falla esto?"), no la solucion entera. El codigo lo escribes tu.
