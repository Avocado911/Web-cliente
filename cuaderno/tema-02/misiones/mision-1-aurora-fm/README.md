# Mision 1 · "Aurora FM": el gestor de playlists inmutable 📻

Nivel 2 · IA como pair · 90 min

## Objetivo

Un modulo de playlist donde ninguna funcion modifique los datos originales, y que sobreviva a un cierre del navegador.

**Practicas:** metodos inmutables, `map`/`filter`/`reduce`, `Object.groupBy`, `structuredClone`, JSON y `localStorage`.

Datos de partida en `playlist.js` (5 canciones):

```js
export const cancionesIniciales = [
	{ id: 1, titulo: "Midnight City", artista: "M83", genero: "synthpop", duracion: 243, favorita: false },
	// ...
];
```

## Fases

1. **Operaciones basicas:** `agregar`, `eliminar`, `alternarFavorita` -> devuelven un array nuevo.
2. **Consultas:** `duracionTotal` ("mm:ss", con `reduce`), `ordenarPor` (`toSorted`), `porGenero` (`Object.groupBy`).
3. **Instantaneas:** `crearInstantanea` con `structuredClone`; demuestra en consola que la copia es independiente.
4. **Persistencia:** `guardar`/`cargar` en `localStorage` (clave `"aurora-fm"`); JSON corrupto -> `cancionesIniciales`, con `try/catch`.
5. **Demo:** `main.js` importa el modulo, encadena operaciones, guarda, recarga y comprueba en Application.

## Criterios de aceptacion

- [ ] Ninguna funcion muta sus argumentos: `console.log` del original antes y despues lo demuestra.
- [ ] `duracionTotal(cancionesIniciales)` devuelve `"21:25"`.
- [ ] `porGenero` agrupa en clasica, rock y synthpop.
- [ ] Modificar una instantanea de `structuredClone` no toca la lista original (ni sus objetos anidados).
- [ ] `cargar()` no lanza excepcion aunque guardes basura a mano en `"aurora-fm"`.
- [ ] Todo en un modulo ES con `export`/`import`.

## Retos extra

- [ ] `deshacer()`: historial de instantaneas en un array y recuperar la anterior.
- [ ] `buscar(lista, texto)` por titulo o artista, sin distinguir mayusculas ni tildes (`normalize("NFD")`, `localeCompare`).

> Semaforo 🟡: pidele a la IA criticas y pistas ("¿esta funcion muta algo?"), no la solucion. El codigo lo escribes tu. Logro: DJ residente.

Nota: los datos completos de las 5 canciones no estan en la presentacion. Deben sumar 1285 segundos (21:25) y cubrir los generos clasica, rock y synthpop.
