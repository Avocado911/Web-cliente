import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearSocio } from "../logica/api.js";
import { clavesSocios } from "../logica/claves.js";

export function useAltaSocio() {
	const clienteConsultas = useQueryClient();
	return useMutation({
		mutationFn: crearSocio,
		// Tras el alta, el listado en cache ya no vale: se marca como obsoleto y se vuelve a pedir.
		// Se devuelve la promesa para que la mutacion siga "pendiente" hasta que llegue el listado nuevo:
		// asi el mensaje de exito y el socio en la lista aparecen a la vez.
		onSuccess: () => clienteConsultas.invalidateQueries({ queryKey: clavesSocios.todas }),
	});
}
