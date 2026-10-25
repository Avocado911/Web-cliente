import { leer, guardar } from "./almacen.js";

const URL_BASE = "https://openlibrary.org";
const URL_BUSQUEDA = `${URL_BASE}/search.json`;
const CAMPOS = "key,title,author_name,first_publish_year,cover_i,language,number_of_pages_median";
const LIMITE_RESULTADOS = 40;
const TIEMPO_MAXIMO = 8000;

const CLAVE_CACHE = "biblioteca-arcana-cache";
const CADUCIDAD_CACHE = 60 * 60 * 1000;
const MAXIMO_BUSQUEDAS_EN_CACHE = 20;

export class ErrorBiblioteca extends Error {
	constructor(mensaje, tipo) {
		super(mensaje);
		this.name = "ErrorBiblioteca";
		this.tipo = tipo;
	}
}

// La cache vive en un Map en memoria y se copia a localStorage para sobrevivir a recargas
const cache = new Map(Object.entries(leer(CLAVE_CACHE, {})));

function construirUrl(texto) {
	const parametros = new URLSearchParams({ q: texto, fields: CAMPOS, limit: LIMITE_RESULTADOS });
	return `${URL_BUSQUEDA}?${parametros}`;
}

function leerDeCache(url) {
	const entrada = cache.get(url);
	if (!entrada) {
		return null;
	}
	if (Date.now() - entrada.fecha > CADUCIDAD_CACHE) {
		cache.delete(url);
		return null;
	}
	return entrada.docs;
}

function guardarEnCache(url, docs) {
	cache.set(url, { fecha: Date.now(), docs });
	// Un Map recuerda el orden de insercion: la primera clave es la busqueda mas antigua
	if (cache.size > MAXIMO_BUSQUEDAS_EN_CACHE) {
		const masAntigua = cache.keys().next().value;
		cache.delete(masAntigua);
	}
	guardar(CLAVE_CACHE, Object.fromEntries(cache));
}

// Peticion comun a la busqueda y al detalle: timeout, cancelacion y errores propios
async function pedirJson(url, senalCancelacion) {
	// La peticion se corta si la cancelan desde fuera o si pasa el tiempo maximo
	const senal = AbortSignal.any([senalCancelacion, AbortSignal.timeout(TIEMPO_MAXIMO)]);

	let respuesta;
	try {
		respuesta = await fetch(url, { signal: senal });
	} catch (error) {
		if (error.name === "AbortError") {
			throw error;
		}
		if (error.name === "TimeoutError") {
			throw new ErrorBiblioteca("La biblioteca tarda demasiado en responder. Prueba otra vez.", "tiempo");
		}
		throw new ErrorBiblioteca("No hay conexion con la biblioteca. Revisa tu red.", "red");
	}

	// fetch no falla con un 404 o un 500: hay que comprobarlo a mano
	if (!respuesta.ok) {
		throw new ErrorBiblioteca(`La biblioteca ha respondido con un error (${respuesta.status}).`, "servidor");
	}
	return respuesta.json();
}

export async function buscarLibros(texto, senalCancelacion) {
	const url = construirUrl(texto);
	const enCache = leerDeCache(url);
	if (enCache) {
		return enCache;
	}
	const datos = await pedirJson(url, senalCancelacion);
	guardarEnCache(url, datos.docs);
	return datos.docs;
}

// El id de un libro es la clave de su obra, por ejemplo "/works/OL45804W"
export function buscarDetalle(id, senalCancelacion) {
	return pedirJson(`${URL_BASE}${id}.json`, senalCancelacion);
}
