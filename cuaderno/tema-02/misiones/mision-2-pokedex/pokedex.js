// Modulo asincrono de la Pokedex: consultas a PokeAPI que toleran fallos y van en paralelo

// La URL del enunciado ("https://api.pokeapi.co") estaba mal a proposito: ese dominio no existe
// y fetch rechaza con TypeError (fallo de red). La buena es esta:
const BASE = "https://pokeapi.co/api/v2";

// Error propio: hereda de Error y anade el codigo HTTP (404, 500...) o 0 si fue la red
export class ErrorPokedex extends Error {
	constructor(mensaje, codigo) {
		super(mensaje);
		this.name = "ErrorPokedex";
		this.codigo = codigo;
	}
}

// Extra: cache en un Map. Clave = nombre, valor = la PROMESA (no el resultado):
// asi si se piden dos veces a la vez, la segunda reutiliza la peticion que ya esta en marcha
const cache = new Map();

// ---------- Fase 5 (+ extra AbortController): paciencia limitada ----------

// conTimeout vale para cualquier promesa: compite con otra que rechaza a los ms milisegundos
// y race se queda con la que termine primero
export function conTimeout(promesa, ms, controlador) {
	let id;
	const reloj = new Promise((_, reject) => {
		id = setTimeout(() => {
			// extra: si nos pasan un AbortController, se cancela la peticion de verdad
			// (sin esto, race "gana" pero el fetch sigue descargando por detras)
			controlador?.abort();
			reject(new ErrorPokedex(`Tiempo agotado (${ms} ms)`, 408));
		}, ms);
	});
	// finally limpia el temporizador gane quien gane, para no dejar timeouts colgando
	return Promise.race([promesa, reloj]).finally(() => clearTimeout(id));
}

// ---------- Fases 1 y 2: consulta basica y errores con clase ----------

async function pedirJson(url, ms = 4000) {
	const controlador = new AbortController();
	let respuesta;
	try {
		respuesta = await conTimeout(fetch(url, { signal: controlador.signal }), ms, controlador);
	} catch (error) {
		if (error instanceof ErrorPokedex) throw error; // el timeout ya viene con su codigo
		// fetch solo rechaza si no hay respuesta (sin red, DNS, abort): codigo 0 = fallo de red
		throw new ErrorPokedex(`Fallo de red: ${error.message}`, 0);
	}
	// un 404 NO hace rechazar a fetch: hay que mirar respuesta.ok a mano
	if (!respuesta.ok) {
		throw new ErrorPokedex(`PokeAPI respondio ${respuesta.status} en ${url}`, respuesta.status);
	}
	return respuesta.json();
}

export function obtenerPokemon(nombre) {
	const clave = nombre.toLowerCase();
	if (cache.has(clave)) return cache.get(clave);

	const promesa = pedirJson(`${BASE}/pokemon/${clave}`).then((datos) => ({
		nombre: datos.name,
		id: datos.id,
		// la API da [{ slot, type: { name, url } }]: nos quedamos solo con el nombre
		tipos: datos.types.map((t) => t.type.name),
		peso: datos.weight / 10, // viene en hectogramos: /10 para kg
	}));

	cache.set(clave, promesa);
	// si falla, se saca de la cache para que el siguiente intento vuelva a preguntar
	promesa.catch(() => cache.delete(clave));
	return promesa;
}

// ---------- Fase 3: equipo en paralelo ----------

// secuencial: cada await espera al anterior, el tiempo total es la SUMA
export async function obtenerEquipoSecuencial(nombres) {
	const equipo = [];
	for (const nombre of nombres) {
		equipo.push(await obtenerPokemon(nombre));
	}
	return equipo;
}

// paralelo: se lanzan todas a la vez y se espera a todas; el tiempo es el de la MAS LENTA.
// Si una falla, all rechaza entera
export function obtenerEquipo(nombres) {
	return Promise.all(nombres.map(obtenerPokemon));
}

// ---------- Fase 4: tolerante a fallos ----------

// allSettled nunca rechaza: devuelve { status: "fulfilled", value } o { status: "rejected", reason }
export async function obtenerEquipoSeguro(nombres) {
	const resultados = await Promise.allSettled(nombres.map(obtenerPokemon));
	return {
		capturados: resultados.filter((r) => r.status === "fulfilled").map((r) => r.value),
		escapados: resultados
			.map((r, i) => ({ nombre: nombres[i], resultado: r }))
			.filter(({ resultado }) => resultado.status === "rejected")
			.map(({ nombre, resultado }) => ({ nombre, motivo: resultado.reason.message })),
	};
}

// ---------- Extra: Promise.any ----------

// any se queda con la PRIMERA que se cumpla (ignora las que fallen); solo rechaza si fallan todas.
// Se piden dos idiomas "a la vez" y gana el que llegue antes
export function nombreEspecie(nombre, idiomas = ["es", "ja"]) {
	const especie = pedirJson(`${BASE}/pokemon-species/${nombre.toLowerCase()}`);
	return Promise.any(
		idiomas.map(async (idioma) => {
			const datos = await especie;
			const traduccion = datos.names.find((n) => n.language.name === idioma);
			if (!traduccion) throw new Error(`sin nombre en ${idioma}`);
			return { idioma, nombre: traduccion.name };
		}),
	);
}

// para que la demo pueda medir sin cache
export function vaciarCache() {
	cache.clear();
}
