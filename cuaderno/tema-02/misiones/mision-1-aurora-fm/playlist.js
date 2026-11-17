// Modulo de playlist inmutable: ninguna funcion toca el array que recibe,
// todas devuelven uno nuevo (como si en C copiaras el array en vez de escribir en el puntero)

// El enunciado solo da la primera cancion; las otras cuatro estan elegidas para que
// cuadren los criterios: tres generos (clasica, rock, synthpop) y 21:25 de duracion total
export const cancionesIniciales = [
	{ id: 1, titulo: "Midnight City", artista: "M83", genero: "synthpop", duracion: 243, favorita: false },
	{ id: 2, titulo: "Bohemian Rhapsody", artista: "Queen", genero: "rock", duracion: 354, favorita: true },
	{ id: 3, titulo: "Take On Me", artista: "a-ha", genero: "synthpop", duracion: 225, favorita: false },
	{ id: 4, titulo: "Clair de Lune", artista: "Debussy", genero: "clasica", duracion: 278, favorita: false },
	{ id: 5, titulo: "Gymnopédie n.º 1", artista: "Satie", genero: "clasica", duracion: 185, favorita: true },
];

const CLAVE = "aurora-fm";

// ---------- Fase 1: operaciones basicas ----------

// spread crea un array nuevo con lo de antes y la cancion al final; el original no cambia
export function agregar(lista, cancion) {
	// el id nuevo es el mayor + 1, asi no se repite aunque se hayan borrado canciones
	const siguienteId = lista.reduce((max, c) => Math.max(max, c.id), 0) + 1;
	return [...lista, { favorita: false, ...cancion, id: siguienteId }];
}

// filter siempre devuelve un array nuevo: se queda con todas menos la del id
export function eliminar(lista, id) {
	return lista.filter((c) => c.id !== id);
}

// map devuelve un array nuevo; la cancion cambiada es un objeto nuevo ({...c}),
// las demas se reutilizan tal cual (no se han tocado, asi que no hace falta copiarlas)
export function alternarFavorita(lista, id) {
	return lista.map((c) => (c.id === id ? { ...c, favorita: !c.favorita } : c));
}

// ---------- Fase 2: consultas ----------

// reduce suma los segundos; luego se pasa a "mm:ss" con padStart para que 5 salga como "05"
export function duracionTotal(lista) {
	const segundos = lista.reduce((total, c) => total + c.duracion, 0);
	const mm = Math.floor(segundos / 60);
	const ss = String(segundos % 60).padStart(2, "0");
	return `${mm}:${ss}`;
}

// toSorted es la version inmutable de sort: sort ordena el array en el sitio, toSorted devuelve otro
export function ordenarPor(lista, campo) {
	return lista.toSorted((a, b) => {
		const x = a[campo];
		const y = b[campo];
		// los textos se comparan con localeCompare (sabe de tildes); los numeros restando
		if (typeof x === "string") return x.localeCompare(y, "es");
		return x - y;
	});
}

// Object.groupBy devuelve { clasica: [...], rock: [...], synthpop: [...] }
export function porGenero(lista) {
	return Object.groupBy(lista, (c) => c.genero);
}

// ---------- Fase 3: instantaneas ----------

// structuredClone copia en profundidad: tambien los objetos de dentro del array.
// Con [...lista] solo se copiaria el array; los objetos cancion serian los mismos (mismas referencias)
export function crearInstantanea(lista) {
	return structuredClone(lista);
}

// ---------- Fase 4: persistencia ----------

// localStorage solo guarda texto: hay que pasar el array a JSON
export function guardar(lista) {
	localStorage.setItem(CLAVE, JSON.stringify(lista));
}

// si no hay nada guardado o el texto no es un JSON valido, se vuelve a las iniciales sin romper
export function cargar() {
	const texto = localStorage.getItem(CLAVE);
	if (texto === null) return crearInstantanea(cancionesIniciales);

	try {
		const datos = JSON.parse(texto);
		// JSON valido pero que no es una lista (por ejemplo "42") tampoco sirve
		if (!Array.isArray(datos)) throw new Error("lo guardado no es una lista");
		return datos;
	} catch (error) {
		console.warn(`"${CLAVE}" estaba corrupto (${error.message}): se cargan las canciones iniciales`);
		return crearInstantanea(cancionesIniciales);
	}
}

// ---------- Retos extra ----------

// deshacer: el historial es un array de instantaneas; cada cambio apila la version anterior.
// Tambien inmutable: devuelve un historial nuevo en vez de hacer push/pop sobre el que llega
export function crearHistorial(lista) {
	return { actual: lista, anteriores: [] };
}

export function aplicar(historial, operacion) {
	return {
		actual: operacion(historial.actual),
		anteriores: [...historial.anteriores, crearInstantanea(historial.actual)],
	};
}

export function deshacer(historial) {
	if (historial.anteriores.length === 0) return historial;
	return {
		actual: historial.anteriores.at(-1),
		anteriores: historial.anteriores.slice(0, -1),
	};
}

// normalize("NFD") separa la letra de su tilde ("é" -> "e" + tilde suelta) y el replace quita las tildes;
// asi "gymnopedie" encuentra "Gymnopédie" y "QUEEN" encuentra "Queen"
function limpiar(texto) {
	return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function buscar(lista, texto) {
	const buscado = limpiar(texto);
	return lista.filter((c) => limpiar(c.titulo).includes(buscado) || limpiar(c.artista).includes(buscado));
}
