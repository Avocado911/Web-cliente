import { useQuery } from "@tanstack/react-query";
import { obtenerSocios } from "../logica/api.js";
import { clavesSocios } from "../logica/claves.js";

// El listado de socios: TanStack Query lo pide, lo guarda en cache y lo comparte entre componentes
export function useSocios() {
	return useQuery({
		queryKey: clavesSocios.lista(),
		queryFn: ({ signal }) => obtenerSocios(signal),
		// Durante 30 s los datos se dan por frescos y no se vuelven a pedir al remontar o al volver a la pestana
		staleTime: 30_000,
	});
}
