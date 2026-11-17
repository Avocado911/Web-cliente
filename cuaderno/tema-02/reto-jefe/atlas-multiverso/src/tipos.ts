// Tipos del Atlas: la forma de lo que manda la API y de lo que guarda la app.
// Solo existen al compilar; en el navegador no queda nada de este fichero

// union de literales: la API solo manda estos tres estados
export type EstadoVital = "Alive" | "Dead" | "unknown";

// un personaje tal como llega de rickandmortyapi.com/api/character (solo los campos que se usan;
// la API manda mas, como episode o location, y TS no se queja por los que sobran)
export interface Personaje {
	readonly id: number;
	name: string;
	status: EstadoVital;
	species: string;
	image: string;
	origin: { name: string };
}

// info de paginacion: next y prev son URLs completas o null en la primera/ultima pagina
export interface InfoPaginas {
	count: number;
	pages: number;
	next: string | null;
	prev: string | null;
}

// respuesta de /character?name=...: generica en T por si se reutiliza para /location o /episode
export interface RespuestaApi<T> {
	info: InfoPaginas;
	results: T[];
}

// lo que se guarda de un favorito: el personaje entero menos lo que no hace falta para pintarlo.
// Pick = "de este tipo, quedate solo con estos campos"
export type Favorito = Pick<Personaje, "id" | "name" | "species" | "status" | "image">;

// tipos de error que distingue la UI, cada uno con su mensaje
export type TipoError = "sin-resultados" | "red" | "timeout" | "servidor" | "respuesta-rara";

// la busqueda que se esta viendo: es lo que va en la URL (?nombre=rick&pagina=2)
export interface Busqueda {
	nombre: string;
	pagina: number;
}
