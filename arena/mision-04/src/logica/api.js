// Capa de servicios: aqui vive todo el fetch. Los componentes no saben ni la URL ni el metodo.
import { esquemaSocio } from "./esquemas.js";

const URL_API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// fetch solo falla (rejects) si no hay red: un 404 o un 500 llegan como respuesta normal
// y hay que mirar response.ok a mano para convertirlos en error.
async function pedir(ruta, opciones) {
	let respuesta;
	try {
		respuesta = await fetch(URL_API + ruta, opciones);
	} catch (error) {
		// Una peticion cancelada por TanStack Query no es un fallo: se deja pasar tal cual
		if (error.name === "AbortError") throw error;
		throw new Error("No se pudo conectar con el archivo de socios. ¿Está arrancado el servidor?");
	}
	if (!respuesta.ok) {
		throw new Error(`El archivo de socios respondió con un error (${respuesta.status}).`);
	}
	return respuesta.json();
}

// Los mas recientes primero. "signal" lo da TanStack Query para poder cancelar la peticion.
// No se da por bueno lo que llega: cada registro pasa por el esquema Zod con safeParse (no lanza),
// asi un dato corrupto no tumba el listado entero: se aparta y se ensena el resto.
export async function obtenerSocios(signal) {
	const json = await pedir("/socios?_sort=id&_order=desc", { signal });
	if (!Array.isArray(json)) {
		throw new Error("El archivo de socios devolvió algo que no es una lista.");
	}

	const socios = [];
	const corruptos = [];
	for (const registro of json) {
		const resultado = esquemaSocio.safeParse(registro);
		if (resultado.success) {
			socios.push(resultado.data);
		} else {
			corruptos.push({
				id: registro?.id ?? null,
				// Un problema por linea: "edad: La edad debe ser un numero"
				problemas: resultado.error.issues.map((problema) => `${problema.path.join(".")}: ${problema.message}`),
			});
		}
	}
	return { socios, corruptos };
}

// Error que pertenece a un campo concreto del formulario (p. ej. correo repetido):
// el formulario lo pinta debajo de ese campo en vez de como error general.
export class ErrorDeCampo extends Error {
	constructor(campo, mensaje) {
		super(mensaje);
		this.campo = campo;
	}
}

const CABECERAS_JSON = { "Content-Type": "application/json" };

// Alta de un socio. "datos" llega ya validado y limpio por el esquema del formulario.
export async function crearSocio(datos) {
	// json-server no sabe de reglas de negocio: la de "un correo, un socio" se comprueba antes de guardar
	const repetidos = await pedir(`/socios?correo=${encodeURIComponent(datos.correo)}`);
	if (repetidos.length > 0) {
		throw new ErrorDeCampo("correo", "Ya hay un socio con ese correo");
	}
	const json = await pedir("/socios", {
		method: "POST",
		headers: CABECERAS_JSON,
		// La fecha de alta la pone la aplicacion, no el usuario
		body: JSON.stringify({ ...datos, alta: new Date().toISOString() }),
	});
	// La respuesta del alta tambien se valida: aqui si es un error, porque sin socio no hay exito que ensenar
	const resultado = esquemaSocio.safeParse(json);
	if (!resultado.success) {
		throw new Error("El servidor guardó el socio pero respondió con datos que no se entienden.");
	}
	return resultado.data;
}

export async function borrarSocio(id) {
	return pedir(`/socios/${id}`, { method: "DELETE" });
}
