import { useEffect, useState } from "react";
import { buscarLibros, ErrorBiblioteca } from "../logica/api.js";
import { normalizarLibro } from "../logica/datos.js";

// Sincroniza la app con OpenLibrary: cada vez que cambia el texto buscado, pide los libros.
// Solo guarda la ultima respuesta; "cargando" se deduce de que esa respuesta no es la actual
export function useBusquedaLibros(texto) {
	const [intento, setIntento] = useState(0);
	const [respuesta, setRespuesta] = useState(null);

	// Identifica una peticion concreta: el mismo texto con otro intento es otra peticion
	const clave = `${texto}#${intento}`;

	useEffect(() => {
		if (texto === "") {
			return;
		}
		const controlador = new AbortController();

		buscarLibros(texto, controlador.signal)
			.then((docs) => {
				if (!controlador.signal.aborted) {
					setRespuesta({ clave, libros: docs.map(normalizarLibro), error: null });
				}
			})
			.catch((error) => {
				if (controlador.signal.aborted) {
					return;
				}
				const mensaje = error instanceof ErrorBiblioteca ? error.message : "Ha ocurrido un error inesperado.";
				setRespuesta({ clave, libros: [], error: mensaje });
			});

		// Limpieza: si el texto cambia antes de que llegue la respuesta, la peticion vieja se cancela
		return () => controlador.abort();
	}, [texto, clave]);

	let estado = "listo";
	if (texto === "") {
		estado = "inicio";
	} else if (respuesta?.clave !== clave) {
		estado = "cargando";
	} else if (respuesta.error) {
		estado = "error";
	}

	return {
		estado,
		libros: estado === "listo" ? respuesta.libros : [],
		error: estado === "error" ? respuesta.error : null,
		reintentar: () => setIntento((anterior) => anterior + 1),
	};
}
