// Transformaciones de datos: funciones puras, ninguna modifica lo que recibe

const URL_PORTADAS = "https://covers.openlibrary.org/b/id";

// Convierte un resultado crudo de la API en el objeto libro que usa la app
export function normalizarLibro(doc) {
	return {
		id: doc.key,
		titulo: doc.title,
		autores: doc.author_name ?? ["Autor desconocido"],
		anio: doc.first_publish_year ?? null,
		paginas: doc.number_of_pages_median ?? null,
		portada: doc.cover_i ? `${URL_PORTADAS}/${doc.cover_i}-M.jpg` : null,
		enEspanol: doc.language?.includes("spa") ?? false,
	};
}

// Une los datos que existan con " · " y se salta los que faltan (tarjeta y detalle)
export function textoDetalles(libro) {
	return [libro.anio ?? "Año desconocido", libro.paginas ? `${libro.paginas} pags.` : null]
		.filter((dato) => dato !== null)
		.join(" · ");
}

export function filtrarLibros(libros, { soloEspanol, soloConPortada }) {
	return libros
		.filter((libro) => !soloEspanol || libro.enEspanol)
		.filter((libro) => !soloConPortada || libro.portada !== null);
}

// Los libros sin anio van siempre al final, ordenes como ordenes
function compararAnios(a, b, sentido) {
	if (a.anio === b.anio) {
		return 0;
	}
	if (a.anio === null) {
		return 1;
	}
	if (b.anio === null) {
		return -1;
	}
	return (a.anio - b.anio) * sentido;
}

export function ordenarLibros(libros, criterio) {
	switch (criterio) {
		case "anio-asc":
			return libros.toSorted((a, b) => compararAnios(a, b, 1));
		case "anio-desc":
			return libros.toSorted((a, b) => compararAnios(a, b, -1));
		case "titulo":
			return libros.toSorted((a, b) => a.titulo.localeCompare(b.titulo, "es"));
		default:
			return libros;
	}
}

export function calcularEstadisticas(libros) {
	const conAnio = libros.filter((libro) => libro.anio !== null);
	const conPaginas = libros.filter((libro) => libro.paginas !== null);

	const porDecada = Object.groupBy(conAnio, (libro) => `${Math.floor(libro.anio / 10) * 10}s`);
	const decadas = Object.entries(porDecada)
		.map(([decada, lista]) => ({ decada, total: lista.length }))
		.toSorted((a, b) => a.decada.localeCompare(b.decada));

	const totalPaginas = conPaginas.reduce((suma, libro) => suma + libro.paginas, 0);
	const mediaPaginas = conPaginas.length > 0 ? Math.round(totalPaginas / conPaginas.length) : null;

	const masAntiguo = conAnio.reduce(
		(antiguo, libro) => (antiguo === null || libro.anio < antiguo.anio ? libro : antiguo),
		null,
	);

	return { total: libros.length, decadas, mediaPaginas, masAntiguo };
}

export function esFavorito(favoritos, id) {
	return favoritos.some((favorito) => favorito.id === id);
}

// Devuelve una lista nueva: con el libro anadido si no estaba, sin el si ya estaba
export function alternarFavorito(favoritos, libro) {
	return esFavorito(favoritos, libro.id)
		? favoritos.filter((favorito) => favorito.id !== libro.id)
		: [...favoritos, libro];
}

// La descripcion de OpenLibrary puede venir como texto o como { type, value }
export function normalizarDetalle(obra) {
	const descripcion = typeof obra.description === "string" ? obra.description : obra.description?.value;
	return {
		// Muchas descripciones acaban con una lista de enlaces separada por guiones: se corta ahi
		descripcion: descripcion ? descripcion.split("----------")[0].trim() : null,
		temas: [...new Set(obra.subjects ?? [])].slice(0, 8),
	};
}
