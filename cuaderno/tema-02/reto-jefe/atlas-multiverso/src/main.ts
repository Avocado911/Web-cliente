// Arranque y eventos: une api, estado y ui. Es el unico sitio donde el estado cambia de valor
import "./estilos.css";
import { ClienteApi, ErrorApi } from "./api.ts";
import * as E from "./estado.ts";
import { elementos, pintar, pintarError } from "./ui.ts";
import type { Busqueda } from "./tipos.ts";

const api = new ClienteApi();
let estado = E.estadoInicial(E.cargarFavoritos());

// el estado solo cambia por aqui: se calcula el nuevo con una funcion pura, se guarda y se repinta
function actualizar(nuevo: E.Estado): void {
	estado = nuevo;
	pintar(estado);
	if (!elementos.stats.hidden) void refrescarEstadisticas();
}

// ---------- enrutado con history.pushState ----------
// La busqueda vive en la URL como ?nombre=rick&pagina=2: se puede compartir el enlace,
// F5 vuelve a la misma busqueda y atras/adelante funcionan. Al ir en los parametros y no en
// la ruta (/rick/2), el servidor siempre recibe "/" y nunca da un 404 al recargar

function leerUrl(): Busqueda | null {
	const params = new URLSearchParams(location.search);
	const nombre = params.get("nombre")?.trim();
	if (!nombre) return null;
	const pagina = Number(params.get("pagina"));
	// Number("") = 0 y Number("abc") = NaN: cualquier cosa rara se queda en la pagina 1
	return { nombre, pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1 };
}

function escribirUrl({ nombre, pagina }: Busqueda): void {
	const params = new URLSearchParams({ nombre, pagina: String(pagina) });
	history.pushState(null, "", `?${params}`);
}

// ---------- busqueda ----------

async function buscar(busqueda: Busqueda): Promise<void> {
	elementos.entrada.value = busqueda.nombre;
	actualizar(E.empezarBusqueda(estado, busqueda));
	try {
		const respuesta = await api.buscar(busqueda);
		actualizar(E.recibirRespuesta(estado, respuesta));
		console.info(`peticiones reales: ${api.peticionesReales} · en cache: ${api.tamanoCache}`);
	} catch (error) {
		// una busqueda mas nueva cancelo esta: no es un error para el usuario
		if (error instanceof DOMException && error.name === "AbortError") return;
		actualizar(E.fallarBusqueda(estado));
		if (error instanceof ErrorApi) pintarError(error.tipo, error.message);
		else pintarError("respuesta-rara", "Algo inesperado ha fallado"); // bug nuestro, no de la API
	}
}

function navegar(busqueda: Busqueda): void {
	escribirUrl(busqueda);
	void buscar(busqueda);
}

elementos.formulario.addEventListener("submit", (evento) => {
	evento.preventDefault(); // sin esto el formulario recarga la pagina
	const nombre = elementos.entrada.value.trim();
	if (nombre) navegar({ nombre, pagina: 1 });
});

elementos.anterior.addEventListener("click", () => {
	if (estado.busqueda) navegar({ ...estado.busqueda, pagina: estado.busqueda.pagina - 1 });
});

elementos.siguiente.addEventListener("click", () => {
	if (estado.busqueda) navegar({ ...estado.busqueda, pagina: estado.busqueda.pagina + 1 });
});

// atras/adelante del navegador: la URL ya ha cambiado, solo hay que pintar lo que dice
window.addEventListener("popstate", () => {
	const busqueda = leerUrl();
	if (busqueda) void buscar(busqueda);
	else actualizar(E.estadoInicial(estado.favoritos));
});

// ---------- favoritos (delegacion: un solo listener para todas las estrellas) ----------

elementos.resultados.addEventListener("click", (evento) => {
	// closest sube desde lo que se ha pulsado hasta el boton estrella, si lo hay
	const boton = (evento.target as HTMLElement).closest<HTMLButtonElement>(".estrella");
	if (!boton) return;
	const personaje = estado.respuesta?.results.find((p) => p.id === Number(boton.dataset.id));
	if (!personaje) return;
	actualizar(E.alternarFavorito(estado, personaje));
	E.guardarFavoritos(estado.favoritos);
});

// ---------- estadisticas con import() dinamico ----------

async function refrescarEstadisticas(): Promise<void> {
	// la primera vez descarga estadisticas.ts; las siguientes ya lo tiene el navegador
	const { pintarEstadisticas } = await import("./estadisticas.ts");
	pintarEstadisticas(elementos.stats, estado);
}

elementos.botonStats.addEventListener("click", async () => {
	elementos.stats.hidden = !elementos.stats.hidden;
	elementos.botonStats.textContent = elementos.stats.hidden ? "Ver estadisticas" : "Ocultar estadisticas";
	if (!elementos.stats.hidden) await refrescarEstadisticas();
});

// ---------- arranque ----------

const inicial = leerUrl();
if (inicial) void buscar(inicial);
else pintar(estado);

// para trastear desde la consola sin poder romper el estado de verdad (es una copia profunda)
Object.assign(window, { atlas: () => E.instantanea(estado) });
