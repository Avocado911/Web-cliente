// Render: lo unico que toca el DOM. Todo el texto se inserta con textContent

const mensaje = document.querySelector("#mensaje");
const resultados = document.querySelector("#resultados");
const panelEstadisticas = document.querySelector("#estadisticas");
const listaFavoritos = document.querySelector("#favoritos");
const contadorFavoritos = document.querySelector("#contador-favoritos");

function crearElemento(etiqueta, clase, texto) {
	const elemento = document.createElement(etiqueta);
	if (clase) {
		elemento.classList.add(clase);
	}
	if (texto !== undefined) {
		elemento.textContent = texto;
	}
	return elemento;
}

export function mostrarMensaje(texto, tipo) {
	mensaje.textContent = texto;
	mensaje.dataset.tipo = tipo;
}

export function mostrarCargando(busqueda) {
	resultados.replaceChildren();
	panelEstadisticas.hidden = true;
	mostrarMensaje(`Consultando los archivos en busca de "${busqueda}"...`, "cargando");
}

export function mostrarError(texto) {
	resultados.replaceChildren();
	panelEstadisticas.hidden = true;
	mostrarMensaje(texto, "error");
}

function crearPortada(libro) {
	if (!libro.portada) {
		const sinPortada = crearElemento("div", "portada", "📖");
		sinPortada.classList.add("sin-portada");
		return sinPortada;
	}
	const imagen = crearElemento("img", "portada");
	imagen.src = libro.portada;
	imagen.alt = `Portada de ${libro.titulo}`;
	imagen.loading = "lazy";
	return imagen;
}

function crearTarjeta(libro, marcado) {
	const tarjeta = crearElemento("article", "libro");

	const detalles = [libro.anio ?? "Año desconocido", libro.paginas ? `${libro.paginas} pags.` : null]
		.filter((dato) => dato !== null)
		.join(" · ");

	const botonFavorito = crearElemento("button", "boton-favorito", marcado ? "★" : "☆");
	botonFavorito.dataset.id = libro.id;
	botonFavorito.setAttribute("aria-pressed", marcado);
	botonFavorito.setAttribute("aria-label", marcado ? "Quitar de la estanteria" : "Guardar en la estanteria");

	tarjeta.append(
		crearPortada(libro),
		crearElemento("h3", null, libro.titulo),
		crearElemento("p", "autores", libro.autores.join(", ")),
		crearElemento("p", "detalles", detalles),
		botonFavorito,
	);
	return tarjeta;
}

export function mostrarLibros(libros, idsFavoritos, textoSiVacio) {
	if (libros.length === 0) {
		resultados.replaceChildren();
		mostrarMensaje(textoSiVacio, "vacio");
		return;
	}
	mostrarMensaje(`${libros.length} libros encontrados`, "datos");
	resultados.replaceChildren(...libros.map((libro) => crearTarjeta(libro, idsFavoritos.has(libro.id))));
}

export function mostrarEstadisticas(estadisticas) {
	if (estadisticas.total === 0) {
		panelEstadisticas.hidden = true;
		return;
	}

	const maximo = Math.max(...estadisticas.decadas.map((decada) => decada.total));
	const lista = crearElemento("ul", "lista-estadisticas");
	for (const { decada, total } of estadisticas.decadas) {
		const fila = crearElemento("li");
		const barra = crearElemento("div", "barra");
		barra.style.width = `${(total / maximo) * 100}%`;
		const nombre = crearElemento("span", null, decada);
		const contenedorBarra = crearElemento("span");
		contenedorBarra.style.flex = "1";
		contenedorBarra.append(barra);
		fila.append(nombre, contenedorBarra, crearElemento("span", null, total));
		lista.append(fila);
	}

	const resumen = [
		`Media de paginas: ${estadisticas.mediaPaginas ?? "sin datos"}`,
		estadisticas.masAntiguo ? `Mas antiguo: ${estadisticas.masAntiguo.titulo} (${estadisticas.masAntiguo.anio})` : null,
	].filter((linea) => linea !== null);

	panelEstadisticas.replaceChildren(
		crearElemento("h2", null, "Libros por decada"),
		lista,
		...resumen.map((linea) => crearElemento("p", "detalles", linea)),
	);
	panelEstadisticas.hidden = false;
}

export function mostrarFavoritos(favoritos) {
	contadorFavoritos.textContent = favoritos.length;

	if (favoritos.length === 0) {
		listaFavoritos.replaceChildren(crearElemento("li", "vacio", "Aun no has guardado ningun libro."));
		return;
	}

	const ordenados = favoritos.toSorted((a, b) => a.titulo.localeCompare(b.titulo, "es"));
	listaFavoritos.replaceChildren(
		...ordenados.map((libro) => {
			const fila = crearElemento("li");
			const quitar = crearElemento("button", "quitar-favorito", "✕");
			quitar.dataset.id = libro.id;
			quitar.setAttribute("aria-label", `Quitar ${libro.titulo} de la estanteria`);
			fila.append(crearElemento("span", null, libro.titulo), quitar);
			return fila;
		}),
	);
}
