// Panel de estadisticas. main.ts lo carga con import() dinamico: este fichero no se descarga
// hasta que se pulsa el boton (en el build sale como un .js aparte; se ve en Network)
import type { Estado } from "./estado.ts";
import type { Favorito, Personaje } from "./tipos.ts";

// funcion pura: de una lista de personajes saca [especie, cuantos], de mas a menos
export function recuentoPorEspecie(personajes: readonly Personaje[]): [string, number][] {
	// Object.groupBy -> { Human: [...], Alien: [...] }; Partial porque cualquier especie puede no estar
	const grupos = Object.groupBy(personajes, (p) => p.species);
	return Object.entries(grupos)
		.map(([especie, lista]): [string, number] => [especie, lista?.length ?? 0])
		.toSorted((a, b) => b[1] - a[1]);
}

// toSorted: ordena una copia; estado.favoritos (que es readonly) ni se toca
export function favoritosOrdenados(favoritos: readonly Favorito[]): Favorito[] {
	return favoritos.toSorted((a, b) => a.name.localeCompare(b.name));
}

function lista(titulo: string, filas: string[]): HTMLElement {
	const seccion = document.createElement("section");
	const h = document.createElement("h3");
	h.textContent = titulo;
	const ul = document.createElement("ul");
	ul.append(
		...filas.map((texto) => {
			const li = document.createElement("li");
			li.textContent = texto;
			return li;
		}),
	);
	seccion.append(h, filas.length ? ul : "Nada todavia");
	return seccion;
}

export function pintarEstadisticas(contenedor: HTMLElement, estado: Estado): void {
	const especies = recuentoPorEspecie(estado.respuesta?.results ?? []);
	const favoritos = favoritosOrdenados(estado.favoritos);
	contenedor.replaceChildren(
		lista(
			"Especies en esta pagina",
			especies.map(([especie, n]) => `${especie}: ${n}`),
		),
		lista(
			"Favoritos (A-Z)",
			favoritos.map((f) => `${f.name} (${f.species})`),
		),
	);
}
