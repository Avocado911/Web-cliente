# Mision 2 · "Pokedex de campo": asincronia en estado salvaje 🎓

Nivel 2 · IA como pair · 90 min

## Objetivo

Un modulo asincrono que consulte Pokemon reales (PokeAPI), tolere fallos de red y cargue equipos en paralelo.

**Practicas:** `fetch`, `async/await`, `try/catch`, errores personalizados, `Promise.all`, `allSettled` y `race`.

Punto de partida:

```js
const BASE = "https://api.pokeapi.co"; // ⚠️ URL incorrecta a proposito

export class ErrorPokedex extends Error {
	constructor(mensaje, codigo) {
		super(mensaje);
		this.name = "ErrorPokedex";
		this.codigo = codigo;
	}
}
```

## Fases

1. **Consulta basica:** `obtenerPokemon(nombre)` -> `{ nombre, id, tipos, peso }`, comprobando `respuesta.ok`.
2. **Errores con clase:** lanza `ErrorPokedex` con `codigo` cuando no sea ok; quien llama distingue con `instanceof` un 404 de un fallo de red.
3. **Equipo en paralelo:** `obtenerEquipo(nombres)` con `Promise.all`; mide con `console.time` frente a la version secuencial.
4. **Tolerante a fallos:** `obtenerEquipoSeguro` con `allSettled` -> `{ capturados, escapados }`.
5. **Paciencia limitada:** `conTimeout(promesa, ms)` con `Promise.race`; nada tarda mas de 4 s.

## Criterios de aceptacion

- [ ] `obtenerPokemon("pikachu")` resuelve con `{ nombre: "pikachu", id: 25, tipos: ["electric"], ... }`.
- [ ] `obtenerPokemon("misingno")` rechaza con un `ErrorPokedex` de codigo 404 (no con un `TypeError`).
- [ ] `Promise.all` con un equipo de 6 es claramente mas rapido que la version secuencial (mediciones en un comentario).
- [ ] `obtenerEquipoSeguro(["pikachu", "misingno", "eevee"])` resuelve con 2 capturados y 1 escapado.
- [ ] `conTimeout` funciona con cualquier promesa, no solo con las de la Pokedex.
- [ ] Ningun error acaba como unhandled rejection en la consola.

## Retos extra

- [ ] Cache en un `Map` para no repetir peticiones (te servira en el reto jefe).
- [ ] `Promise.any` para consultar la especie en dos idiomas y quedarte con la primera.
- [ ] `AbortController`: cancelar de verdad la peticion al expirar el timeout.

Pistas: `all` rechaza en cuanto una falla, por eso el equipo "seguro" usa `allSettled`; en `allSettled` cada resultado tiene `status` y `value`/`reason`. Logro: Maestra/o Pokemon.
