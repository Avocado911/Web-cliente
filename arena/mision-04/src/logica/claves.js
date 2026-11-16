// Las claves de TanStack Query, en un solo sitio: quien pide y quien invalida usan la misma.
// Van de lo general a lo concreto, asi invalidar ["socios"] alcanza a todo lo que empiece igual.
export const clavesSocios = {
	todas: ["socios"],
	lista: () => [...clavesSocios.todas, "lista"],
};
