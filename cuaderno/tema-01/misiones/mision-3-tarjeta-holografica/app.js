const TEMAS = ["tema-aurora", "tema-neon", "tema-ocaso"];
const NOMBRE_POR_DEFECTO = "Tu nombre";
const LEMA_NORMAL = "Aprendiz de hechicero del DOM";
const LEMA_SECRETO = "✨ Modo holograma desbloqueado";

const tarjeta = document.querySelector("#tarjeta");
const nombre = document.querySelector("#nombre");
const lema = document.querySelector("#lema");
const marcadorVisitas = document.querySelector("#visitas");
const entradaNombre = document.querySelector("#entrada-nombre");
const botonTema = document.querySelector("#cambiar-tema");

// Closure: indice solo existe dentro de crearAlternador, cada alternador tiene el suyo
function crearAlternador(temas) {
	let indice = 0;
	return () => {
		indice = (indice + 1) % temas.length;
		return temas[indice];
	};
}

const siguienteTema = crearAlternador(TEMAS);
let temaActual = TEMAS[0];
let visitas = 0;

function cambiarTema() {
	tarjeta.classList.remove(temaActual);
	temaActual = siguienteTema();
	tarjeta.classList.add(temaActual);
}

function alternarLema() {
	lema.textContent = lema.textContent === LEMA_SECRETO ? LEMA_NORMAL : LEMA_SECRETO;
}

tarjeta.addEventListener("mouseover", () => {
	tarjeta.classList.add("brillo");
});

tarjeta.addEventListener("mouseout", () => {
	tarjeta.classList.remove("brillo");
});

// mouseenter no se repite al pasar por los hijos de la tarjeta, mouseover si
tarjeta.addEventListener("mouseenter", () => {
	visitas++;
	marcadorVisitas.textContent = visitas;
});

tarjeta.addEventListener("dblclick", alternarLema);

entradaNombre.addEventListener("input", () => {
	nombre.textContent = entradaNombre.value.trim() || NOMBRE_POR_DEFECTO;
});

botonTema.addEventListener("click", cambiarTema);

document.addEventListener("keydown", (event) => {
	// Mientras se escribe el nombre, las teclas no activan atajos
	if (event.target === entradaNombre) {
		return;
	}
	if (event.key.toLowerCase() === "h") {
		lema.textContent = LEMA_SECRETO;
	}
	if (event.key === "ArrowRight") {
		cambiarTema();
	}
});
