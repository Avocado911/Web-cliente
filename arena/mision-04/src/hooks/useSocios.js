import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { obtenerSocios } from "../logica/api.js";
import { clavesSocios } from "../logica/claves.js";

// El listado de socios: TanStack Query lo pide, lo guarda en cache y lo comparte entre componentes.
// El filtro va dentro de la clave: cada carne tiene su propia entrada en la cache y, al cambiarlo,
// la clave cambia y la peticion se lanza sola (no hace falta ningun useEffect).
export function useSocios(carne) {
	return useQuery({
		queryKey: clavesSocios.lista({ carne }),
		queryFn: ({ signal }) => obtenerSocios({ carne, signal }),
		// Durante 30 s los datos se dan por frescos y no se vuelven a pedir al remontar o al volver a la pestana
		staleTime: 30_000,
		// Al cambiar de filtro se sigue viendo la lista anterior hasta que llega la nueva (sin parpadeo de "cargando")
		placeholderData: keepPreviousData,
	});
}
