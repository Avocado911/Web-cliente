import "./style.css";
import { buscarLibros, ErrorBiblioteca } from "./api.js";
import { normalizarLibro, filtrarLibros, ordenarLibros, calcularEstadisticas } from "./datos.js";
import * as ui from "./ui.js";

const formulario = document.querySelector("#formulario");
const campoBusqueda = document.querySelector("#busqueda");
const selectorOrden = document.querySelector("#orden");
const casillaEspanol = document.querySelector("#solo-espanol");
const casillaPortada = document.querySelector("#solo-portada");

const estado = {
	libros: [],
	ultimaBusqueda: null,
	controlador: null,
};

function librosVisibles() {
	const filtros = { soloEspanol: casillaEspanol.checked, soloConPortada: casillaPortada.checked };
	return ordenarLibros(filtrarLibros(estado.libros, filtros), selectorOrden.value);
}

function pintarResultados() {
	if (estado.ultimaBusqueda === null) {
		return;
	}
	const textoSiVacio = estado.libros.length === 0
		? `No hay ningun libro que coincida con "${estado.ultimaBusqueda}".`
		: "Ningun libro cumple los filtros elegidos.";

	const visibles = librosVisibles();
	ui.mostrarLibros(visibles, new Set(), textoSiVacio);
	ui.mostrarEstadisticas(calcularEstadisticas(visibles));
}

async function buscar(texto) {
	// Si habia una busqueda en marcha, se cancela para que no pise a la nueva
	estado.controlador?.abort();
	const controlador = new AbortController();
	estado.controlador = controlador;

	ui.mostrarCargando(texto);
	try {
		const docs = await buscarLibros(texto, controlador.signal);
		estado.libros = docs.map(normalizarLibro);
		estado.ultimaBusqueda = texto;
		pintarResultados();
	} catch (error) {
		if (error.name === "AbortError") {
			return;
		}
		ui.mostrarError(error instanceof ErrorBiblioteca ? error.message : "Ha ocurrido un error inesperado.");
	}
}

formulario.addEventListener("submit", (event) => {
	event.preventDefault();
	const texto = campoBusqueda.value.trim();
	if (texto === "") {
		ui.mostrarMensaje("Escribe un titulo o un autor para empezar a buscar.", "aviso");
		return;
	}
	buscar(texto);
});

for (const control of [selectorOrden, casillaEspanol, casillaPortada]) {
	control.addEventListener("change", pintarResultados);
}

ui.mostrarMensaje("Busca un titulo o un autor para explorar la biblioteca.", "inicio");
