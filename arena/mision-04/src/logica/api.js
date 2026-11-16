// Capa de servicios: aqui vive todo el fetch. Los componentes no saben ni la URL ni el metodo.
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
export async function obtenerSocios(signal) {
	return pedir("/socios?_sort=id&_order=desc", { signal });
}
