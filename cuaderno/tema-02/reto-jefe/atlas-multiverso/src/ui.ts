// Todo lo que toca el DOM. Las tarjetas se construyen con createElement y textContent,
// nunca metiendo texto de la API en innerHTML: si un nombre trajera "<script>", se veria como texto
// y no se ejecutaria (evita XSS)
import type { Estado } from "./estado.ts";
import { esFavorito } from "./estado.ts";
import type { Personaje, TipoError } from "./tipos.ts";

// querySelector generico: devuelve el tipo de elemento que se le dice o lanza si no esta en el HTML
function $<T extends HTMLElement>(selector: string): T {
	const el = document.querySelector<T>(selector);
	if (!el) throw new Error(`Falta ${selector} en index.html`);
	return el;
}

export const elementos = {
	formulario: $<HTMLFormElement>("#buscador"),
	entrada: $<HTMLInputElement>("#nombre"),
	resultados: $<HTMLElement>("#resultados"),
	mensaje: $<HTMLParagraphElement>("#mensaje"),
	anterior: $<HTMLButtonElement>("#anterior"),
	siguiente: $<HTMLButtonElement>("#siguiente"),
	pagina: $<HTMLSpanElement>("#pagina"),
	botonStats: $<HTMLButtonElement>("#ver-stats"),
	stats: $<HTMLElement>("#stats"),
};

// Record<TipoError, string>: TS obliga a que haya un mensaje para CADA tipo de error.
// Si mañana se anade un tipo nuevo a TipoError, esto deja de compilar hasta que se escriba su mensaje
const AYUDA: Record<TipoError, string> = {
	"sin-resultados": "Prueba con otro nombre (por ejemplo: rick, morty, summer).",
	red: "Revisa tu conexion a internet y vuelve a intentarlo.",
	timeout: "La API va lenta ahora mismo. Vuelve a intentarlo en un rato.",
	servidor: "El problema es de la API, no tuyo. Prueba mas tarde.",
	"respuesta-rara": "La API ha cambiado algo. Avisa a quien mantiene el Atlas.",
};

const ESTADO_ES: Record<Personaje["status"], string> = {
	Alive: "Vivo",
	Dead: "Muerto",
	unknown: "Desconocido",
};

function crearTarjeta(p: Personaje, favorito: boolean): HTMLElement {
	const tarjeta = document.createElement("article");
	tarjeta.className = "tarjeta";

	const imagen = document.createElement("img");
	imagen.src = p.image;
	imagen.alt = p.name;
	imagen.loading = "lazy"; // no descarga la imagen hasta que se va a ver

	const nombre = document.createElement("h3");
	nombre.textContent = p.name;

	const datos = document.createElement("p");
	datos.textContent = `${p.species} · ${ESTADO_ES[p.status]}`;
	datos.className = `estado estado-${p.status.toLowerCase()}`;

	const estrella = document.createElement("button");
	estrella.type = "button";
	estrella.className = "estrella";
	estrella.textContent = favorito ? "★" : "☆";
	estrella.ariaLabel = favorito ? `Quitar ${p.name} de favoritos` : `Marcar ${p.name} como favorito`;
	// el id viaja en el boton: main.ts escucha los clics en el contenedor (delegacion de eventos)
	estrella.dataset.id = String(p.id);

	tarjeta.append(imagen, nombre, datos, estrella);
	return tarjeta;
}

export function pintar(estado: Estado): void {
	const { resultados, mensaje, anterior, siguiente, pagina } = elementos;

	if (estado.cargando) {
		mensaje.textContent = "Buscando en el multiverso…";
		mensaje.className = "mensaje";
		return;
	}

	// replaceChildren borra lo que habia y mete lo nuevo de una vez
	const personajes = estado.respuesta?.results ?? [];
	resultados.replaceChildren(...personajes.map((p) => crearTarjeta(p, esFavorito(estado, p.id))));

	const info = estado.respuesta?.info;
	anterior.disabled = !info?.prev;
	siguiente.disabled = !info?.next;
	pagina.textContent = info && estado.busqueda ? `Pagina ${estado.busqueda.pagina} de ${info.pages}` : "";

	if (info) {
		mensaje.textContent = `${info.count} personajes encontrados · ${estado.favoritos.length} favoritos`;
		mensaje.className = "mensaje";
	} else if (!estado.busqueda) {
		mensaje.textContent = `Busca un personaje para empezar · ${estado.favoritos.length} favoritos guardados`;
		mensaje.className = "mensaje";
	}
}

// el error se ve en la pagina con su mensaje y su ayuda, nunca solo en la consola
export function pintarError(tipo: TipoError, texto: string): void {
	elementos.resultados.replaceChildren();
	elementos.anterior.disabled = true;
	elementos.siguiente.disabled = true;
	elementos.pagina.textContent = "";
	elementos.mensaje.textContent = `${texto}. ${AYUDA[tipo]}`;
	elementos.mensaje.className = `mensaje error error-${tipo}`;
}
