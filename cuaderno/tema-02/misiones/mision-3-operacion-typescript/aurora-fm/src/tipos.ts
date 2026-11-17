// Fase 2: la forma de los datos. Esto no genera nada de JS: al compilar desaparece entero

// interface = el "struct" de la cancion, pero solo para que el compilador compruebe
export interface Cancion {
	readonly id: number; // readonly: una vez creada, el id no se puede reasignar
	titulo: string;
	artista: string;
	genero: string;
	duracion: number; // en segundos
	favorita: boolean;
}

// union de literales: CampoOrden no es "cualquier string", es SOLO uno de estos tres textos.
// Asi ordenarPor(lista, "precio") falla al escribirlo, no al ejecutarlo
export type CampoOrden = "titulo" | "artista" | "duracion";

// para agregar: todo lo de una Cancion menos id (lo pone la funcion) y favorita (por defecto false).
// Omit es una utilidad de TS: "este tipo quitandole estos campos"
export type CancionNueva = Omit<Cancion, "id" | "favorita">;

// Reto extra: resultado que o sale bien o sale mal, y TS obliga a mirar cual antes de usarlo.
// Es una union discriminada: el campo ok (true/false) dice cual de las dos formas es
export type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string };
