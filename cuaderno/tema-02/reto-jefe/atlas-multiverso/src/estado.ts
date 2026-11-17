// Estado centralizado: TODO lo que la app sabe esta en un solo objeto.
// Las funciones de aqui son puras: reciben el estado y devuelven uno nuevo, nunca lo modifican.
// Solo guardarFavoritos/cargarFavoritos tocan el exterior (localStorage)
import type { Busqueda, Favorito, Personaje, RespuestaApi } from "./tipos.ts";

const CLAVE_FAVORITOS = "atlas-favoritos";

export interface Estado {
	readonly busqueda: Busqueda | null; // null = todavia no se ha buscado nada
	readonly respuesta: RespuestaApi<Personaje> | null;
	readonly favoritos: readonly Favorito[];
	readonly cargando: boolean;
}

export function estadoInicial(favoritos: readonly Favorito[]): Estado {
	return { busqueda: null, respuesta: null, favoritos, cargando: false };
}

// ---------- transiciones puras: mismo estado de entrada -> mismo estado de salida ----------

export function empezarBusqueda(estado: Estado, busqueda: Busqueda): Estado {
	return { ...estado, busqueda, cargando: true };
}

export function recibirRespuesta(estado: Estado, respuesta: RespuestaApi<Personaje>): Estado {
	return { ...estado, respuesta, cargando: false };
}

export function fallarBusqueda(estado: Estado): Estado {
	return { ...estado, respuesta: null, cargando: false };
}

export function esFavorito(estado: Estado, id: number): boolean {
	return estado.favoritos.some((f) => f.id === id);
}

// si ya estaba se quita (filter), si no se anade (spread): siempre un array nuevo
export function alternarFavorito(estado: Estado, personaje: Personaje): Estado {
	const favoritos = esFavorito(estado, personaje.id)
		? estado.favoritos.filter((f) => f.id !== personaje.id)
		: [...estado.favoritos, aFavorito(personaje)];
	return { ...estado, favoritos };
}

// solo los campos que hacen falta para pintarlo luego sin pedir nada a la API
function aFavorito({ id, name, species, status, image }: Personaje): Favorito {
	return { id, name, species, status, image };
}

// ---------- persistencia ----------

export function guardarFavoritos(favoritos: readonly Favorito[]): void {
	try {
		localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
	} catch {
		// modo privado o almacenamiento lleno: la app sigue, solo que no recordara los favoritos
	}
}

function esFavoritoValido(valor: unknown): valor is Favorito {
	if (typeof valor !== "object" || valor === null) return false;
	const f = valor as Record<string, unknown>;
	return (
		typeof f.id === "number" &&
		typeof f.name === "string" &&
		typeof f.species === "string" &&
		typeof f.status === "string" &&
		typeof f.image === "string"
	);
}

// lo guardado puede estar roto o ser de otra version: si algo no cuadra, lista vacia sin romper
export function cargarFavoritos(): Favorito[] {
	try {
		const datos: unknown = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) ?? "[]");
		return Array.isArray(datos) ? datos.filter(esFavoritoValido) : [];
	} catch {
		return [];
	}
}

// copia profunda para quien quiera trastear con los datos sin tocar el estado (lo usa la consola)
export function instantanea(estado: Estado): Estado {
	return structuredClone(estado);
}
