import "./style.css";
import { buscarLibros, ErrorBiblioteca } from "./api.js";
import { normalizarLibro, filtrarLibros, ordenarLibros, calcularEstadisticas, alternarFavorito } from "./datos.js";
import { leer, guardar } from "./almacen.js";
import * as ui from "./ui.js";

const CLAVE_FAVORITOS = "biblioteca-arcana-favoritos";

const formulario = document.querySelector("#formulario");
const campoBusqueda = document.querySelector("#busqueda");
const selectorOrden = document.querySelector("#orden");
const casillaEspanol = document.querySelector("#solo-espanol");
const casillaPortada = document.querySelector("#solo-portada");
const resultados = document.querySelector("#resultados");
const listaFavoritos = document.querySelector("#favoritos");

function cargarFavoritos() {
	const guardados = leer(CLAVE_FAVORITOS, []);
	return Array.isArray(guardados) ? guardados : [];
}

const estado = {
	libros: [],
	favoritos: cargarFavoritos(),
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
	const idsFavoritos = new Set(estado.favoritos.map((libro) => libro.id));
	ui.mostrarLibros(visibles, idsFavoritos, textoSiVacio);
	ui.mostrarEstadisticas(calcularEstadisticas(visibles));
}

function cambiarFavorito(id) {
	const libro = estado.libros.find((l) => l.id === id) ?? estado.favoritos.find((l) => l.id === id);
	if (!libro) {
		return;
	}
	estado.favoritos = alternarFavorito(estado.favoritos, libro);
	guardar(CLAVE_FAVORITOS, estado.favoritos);
	ui.mostrarFavoritos(estado.favoritos);
	pintarResultados();
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

// Delegacion: un listener por contenedor sirve para todas las tarjetas, aunque se repinten
resultados.addEventListener("click", (event) => {
	const boton = event.target.closest(".boton-favorito");
	if (boton) {
		cambiarFavorito(boton.dataset.id);
	}
});

listaFavoritos.addEventListener("click", (event) => {
	const boton = event.target.closest(".quitar-favorito");
	if (boton) {
		cambiarFavorito(boton.dataset.id);
	}
});

ui.mostrarFavoritos(estado.favoritos);
ui.mostrarMensaje("Busca un titulo o un autor para explorar la biblioteca.", "inicio");
