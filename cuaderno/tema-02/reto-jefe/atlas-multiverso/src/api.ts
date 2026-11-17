// ClienteApi: todas las peticiones a la API pasan por aqui.
// fetch + respuesta.ok + timeout + cancelacion + cache en un Map con caducidad y tamano maximo
import type { Busqueda, Personaje, RespuestaApi, TipoError } from "./tipos.ts";

const BASE = "https://rickandmortyapi.com/api";

// error propio con el tipo, para que la UI ponga un mensaje distinto en cada caso
export class ErrorApi extends Error {
	readonly tipo: TipoError;

	constructor(tipo: TipoError, mensaje: string) {
		super(mensaje);
		this.name = "ErrorApi";
		this.tipo = tipo;
	}
}

// lo que se guarda en cada hueco de la cache: los datos y cuando caducan
interface EntradaCache<T> {
	datos: T;
	caduca: number; // milisegundos desde 1970 (Date.now())
}

interface OpcionesCliente {
	timeoutMs?: number;
	vidaCacheMs?: number;
	maxEntradas?: number;
}

// comprobacion minima de que lo que llega tiene forma de RespuestaApi.
// response.json() devuelve any: se trata como unknown hasta pasar por aqui
function esRespuestaPersonajes(valor: unknown): valor is RespuestaApi<Personaje> {
	if (typeof valor !== "object" || valor === null) return false;
	const v = valor as Record<string, unknown>;
	return typeof v.info === "object" && v.info !== null && Array.isArray(v.results);
}

export class ClienteApi {
	// # = privado de verdad (ni desde fuera ni desde la consola se puede leer).
	// Map y no objeto: la clave es la URL entera y Map recuerda el orden de insercion,
	// que sirve para saber cual es la entrada mas vieja
	#cache = new Map<string, EntradaCache<RespuestaApi<Personaje>>>();
	#controlador: AbortController | null = null;
	#timeoutMs: number;
	#vidaCacheMs: number;
	#maxEntradas: number;
	// contador para comprobar la cache sin abrir Network: cuantas veces se ha llamado a fetch
	peticionesReales = 0;

	constructor({ timeoutMs = 8000, vidaCacheMs = 5 * 60_000, maxEntradas = 30 }: OpcionesCliente = {}) {
		this.#timeoutMs = timeoutMs;
		this.#vidaCacheMs = vidaCacheMs;
		this.#maxEntradas = maxEntradas;
	}

	// URLSearchParams monta "?name=rick&page=2" y escapa espacios y simbolos
	static urlBusqueda({ nombre, pagina }: Busqueda): string {
		const params = new URLSearchParams({ name: nombre, page: String(pagina) });
		return `${BASE}/character/?${params}`;
	}

	async buscar(busqueda: Busqueda): Promise<RespuestaApi<Personaje>> {
		const url = ClienteApi.urlBusqueda(busqueda);

		// 1) cache: si esta y no ha caducado, se devuelve sin tocar la red
		const guardada = this.#cache.get(url);
		if (guardada && guardada.caduca > Date.now()) return guardada.datos;
		if (guardada) this.#cache.delete(url); // caducada: fuera

		// 2) si habia otra busqueda en marcha, se cancela: solo interesa la ultima
		//    (si escribes "ri" y luego "rick", la de "ri" ya no hace falta)
		this.#controlador?.abort();
		const controlador = new AbortController();
		this.#controlador = controlador;

		// 3) timeout: si la API no contesta en timeoutMs, se aborta la peticion de verdad
		let porTimeout = false;
		const reloj = setTimeout(() => {
			porTimeout = true;
			controlador.abort();
		}, this.#timeoutMs);

		let respuesta: Response;
		try {
			this.peticionesReales++;
			respuesta = await fetch(url, { signal: controlador.signal });
		} catch (error) {
			// fetch solo rechaza si no hay respuesta: sin red, DNS, o abortada
			if (porTimeout) throw new ErrorApi("timeout", "La API tarda demasiado en contestar");
			// abortada por una busqueda mas nueva: se relanza tal cual y main.ts la ignora
			if (error instanceof DOMException && error.name === "AbortError") throw error;
			throw new ErrorApi("red", "No hay conexion con la API");
		} finally {
			clearTimeout(reloj);
		}

		// un 404 o un 500 NO hacen rechazar a fetch: hay que mirar ok a mano
		if (respuesta.status === 404) {
			throw new ErrorApi("sin-resultados", `Ningun personaje se llama "${busqueda.nombre}"`);
		}
		if (!respuesta.ok) {
			throw new ErrorApi("servidor", `La API ha fallado (codigo ${respuesta.status})`);
		}

		const datos: unknown = await respuesta.json();
		if (!esRespuestaPersonajes(datos)) {
			throw new ErrorApi("respuesta-rara", "La API ha devuelto algo que no se entiende");
		}

		this.#guardarEnCache(url, datos);
		return datos;
	}

	#guardarEnCache(url: string, datos: RespuestaApi<Personaje>): void {
		// limite de tamano: si esta lleno se borra la mas antigua (la primera clave del Map)
		if (this.#cache.size >= this.#maxEntradas) {
			const masVieja = this.#cache.keys().next().value;
			if (masVieja !== undefined) this.#cache.delete(masVieja);
		}
		this.#cache.set(url, { datos, caduca: Date.now() + this.#vidaCacheMs });
	}

	get tamanoCache(): number {
		return this.#cache.size;
	}
}
