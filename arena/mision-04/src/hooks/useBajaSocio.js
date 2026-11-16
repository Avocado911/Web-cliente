import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarSocio } from "../logica/api.js";
import { clavesSocios } from "../logica/claves.js";

export function useBajaSocio() {
	const clienteConsultas = useQueryClient();
	return useMutation({
		mutationFn: borrarSocio,
		onSuccess: () => clienteConsultas.invalidateQueries({ queryKey: clavesSocios.todas }),
	});
}
