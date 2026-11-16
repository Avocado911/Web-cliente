// Las claves de TanStack Query, en un solo sitio: quien pide y quien invalida usan la misma.
// Van de lo general a lo concreto: ["socios"] -> ["socios", "lista", { carne: "lector" }].
// Invalidar ["socios"] alcanza a todas las que empiezan igual, sea cual sea el filtro.
export const clavesSocios = {
	todas: ["socios"],
	lista: (filtros = {}) => [...clavesSocios.todas, "lista", filtros],
};
