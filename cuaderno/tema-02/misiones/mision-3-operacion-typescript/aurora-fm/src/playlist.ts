// Fase 3: playlist.js de la mision 1 pasado a TypeScript. La logica es la misma;
// lo nuevo son los tipos de cada firma (parametros y retorno)
// `import type`: solo se importan tipos, asi que al compilar esta linea desaparece
import type { Cancion, CampoOrden, CancionNueva, Resultado } from "./tipos";

const CLAVE = "aurora-fm";

// readonly Cancion[]: ni siquiera el array se puede mutar (push, sort... marcan error).
// El compilador garantiza la inmutabilidad que en la mision 1 solo prometiamos
export const cancionesIniciales: readonly Cancion[] = [
	{ id: 1, titulo: "Midnight City", artista: "M83", genero: "synthpop", duracion: 243, favorita: false },
	{ id: 2, titulo: "Bohemian Rhapsody", artista: "Queen", genero: "rock", duracion: 354, favorita: true },
	{ id: 3, titulo: "Take On Me", artista: "a-ha", genero: "synthpop", duracion: 225, favorita: false },
	{ id: 4, titulo: "Clair de Lune", artista: "Debussy", genero: "clasica", duracion: 278, favorita: false },
	{ id: 5, titulo: "Gymnopédie n.º 1", artista: "Satie", genero: "clasica", duracion: 185, favorita: true },
];

// ---------- Operaciones basicas ----------

export function agregar(lista: readonly Cancion[], cancion: CancionNueva): Cancion[] {
	const siguienteId = lista.reduce((max, c) => Math.max(max, c.id), 0) + 1;
	return [...lista, { ...cancion, id: siguienteId, favorita: false }];
}

export function eliminar(lista: readonly Cancion[], id: number): Cancion[] {
	return lista.filter((c) => c.id !== id);
}

export function alternarFavorita(lista: readonly Cancion[], id: number): Cancion[] {
	return lista.map((c) => (c.id === id ? { ...c, favorita: !c.favorita } : c));
}

// ---------- Consultas ----------

export function duracionTotal(lista: readonly Cancion[]): string {
	const segundos = lista.reduce((total, c) => total + c.duracion, 0);
	const mm = Math.floor(segundos / 60);
	const ss = String(segundos % 60).padStart(2, "0");
	return `${mm}:${ss}`;
}

export function ordenarPor(lista: readonly Cancion[], campo: CampoOrden): Cancion[] {
	return lista.toSorted((a, b) => {
		// "duracion" es el unico campo numerico de CampoOrden: dentro del if TS sabe que son numeros
		if (campo === "duracion") return a.duracion - b.duracion;
		// aqui campo solo puede ser "titulo" o "artista": los dos son string
		return a[campo].localeCompare(b[campo], "es");
	});
}

// Reto extra: Partial<Record<string, Cancion[]>> = "un objeto cuyas claves son textos y sus valores
// listas de canciones, pero cualquier clave puede faltar". Es justo lo que devuelve Object.groupBy:
// si no hay rock, la clave rock no existe y TS obliga a contar con ese undefined
export function porGenero(lista: readonly Cancion[]): Partial<Record<string, Cancion[]>> {
	return Object.groupBy(lista, (c) => c.genero);
}

// ---------- Instantaneas ----------

export function crearInstantanea(lista: readonly Cancion[]): Cancion[] {
	return structuredClone([...lista]);
}

// ---------- Persistencia ----------

export function guardar(lista: readonly Cancion[]): void {
	localStorage.setItem(CLAVE, JSON.stringify(lista));
}

// JSON.parse devuelve any (TS no sabe que hay dentro del texto). Para no meter any en el proyecto
// se guarda como unknown ("no se que es, compruebalo antes de usarlo") y se valida a mano.
// Esto es un "type guard": si devuelve true, TS pasa a tratar el valor como Cancion
function esCancion(valor: unknown): valor is Cancion {
	if (typeof valor !== "object" || valor === null) return false;
	const c = valor as Record<string, unknown>;
	return (
		typeof c.id === "number" &&
		typeof c.titulo === "string" &&
		typeof c.artista === "string" &&
		typeof c.genero === "string" &&
		typeof c.duracion === "number" &&
		typeof c.favorita === "boolean"
	);
}

// Reto extra: cargar devuelve Resultado<Cancion[]> en vez de lanzar o devolver las iniciales a escondidas.
// Quien llama esta obligado a mirar resultado.ok antes de poder leer resultado.valor
export function cargar(): Resultado<Cancion[]> {
	const texto = localStorage.getItem(CLAVE);
	if (texto === null) return { ok: false, error: "no hay nada guardado" };

	let datos: unknown;
	try {
		datos = JSON.parse(texto);
	} catch {
		return { ok: false, error: "lo guardado no es JSON valido" };
	}

	if (!Array.isArray(datos) || !datos.every(esCancion)) {
		return { ok: false, error: "lo guardado no es una lista de canciones" };
	}
	return { ok: true, valor: datos };
}
