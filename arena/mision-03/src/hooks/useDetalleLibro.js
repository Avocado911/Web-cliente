import { useEffect, useState } from "react";
import { buscarDetalle, ErrorBiblioteca } from "../logica/api.js";
import { normalizarDetalle } from "../logica/datos.js";

// Pide la ficha de una obra (descripcion y temas), que la busqueda no trae.
// Mismo patron que useBusquedaLibros: "cargando" es que la respuesta guardada no es de este id
export function useDetalleLibro(id) {
	const [respuesta, setRespuesta] = useState(null);

	useEffect(() => {
		const controlador = new AbortController();

		buscarDetalle(id, controlador.signal)
			.then((obra) => {
				if (!controlador.signal.aborted) {
					setRespuesta({ id, detalle: normalizarDetalle(obra), error: null });
				}
			})
			.catch((error) => {
				if (controlador.signal.aborted) {
					return;
				}
				const mensaje = error instanceof ErrorBiblioteca ? error.message : "No se ha podido cargar la ficha.";
				setRespuesta({ id, detalle: null, error: mensaje });
			});

		// Si se cierra el detalle o se abre otro libro antes de que llegue la ficha, se cancela
		return () => controlador.abort();
	}, [id]);

	if (respuesta?.id !== id) {
		return { estado: "cargando", detalle: null, error: null };
	}
	return { estado: respuesta.error ? "error" : "listo", detalle: respuesta.detalle, error: respuesta.error };
}
