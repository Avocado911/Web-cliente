const DURACION = 30;
const TOTAL_CASILLAS = 9;
const PROBABILIDAD_DORADO = 0.15;
const PUNTOS_BUG = 1;
const PUNTOS_DORADO = 5;

const tablero = document.querySelector("#tablero");
const marcadorPuntos = document.querySelector("#puntos");
const marcadorTiempo = document.querySelector("#tiempo");
const marcadorRecord = document.querySelector("#record");
const botonJugar = document.querySelector("#jugar");
const mensaje = document.querySelector("#mensaje");

const estado = {
	jugando: false,
	puntos: 0,
	tiempo: DURACION,
	record: 0,
	casillaBug: null,
	reloj: null,
	temporizadorBug: null,
};

function crearTablero() {
	for (let i = 1; i <= TOTAL_CASILLAS; i++) {
		const casilla = document.createElement("button");
		casilla.classList.add("casilla");
		casilla.setAttribute("aria-label", `Casilla ${i}`);
		tablero.append(casilla);
	}
}

function actualizarMarcador() {
	marcadorPuntos.textContent = estado.puntos;
	marcadorTiempo.textContent = estado.tiempo;
	marcadorRecord.textContent = estado.record;
}

// Dificultad creciente: cada 10 s el bug cambia de casilla mas rapido
function ritmoActual() {
	if (estado.tiempo > 20) {
		return 1000;
	}
	if (estado.tiempo > 10) {
		return 800;
	}
	return 600;
}

function esconderBug() {
	if (!estado.casillaBug) {
		return;
	}
	estado.casillaBug.classList.remove("bug", "dorado");
	estado.casillaBug.textContent = "";
	estado.casillaBug = null;
}

// setTimeout encadenado: cada aparicion programa la siguiente
function aparecerBug() {
	if (!estado.jugando) {
		return;
	}
	esconderBug();

	const casillas = tablero.children;
	const casilla = casillas[Math.floor(Math.random() * casillas.length)];
	const esDorado = Math.random() < PROBABILIDAD_DORADO;

	casilla.classList.add("bug");
	if (esDorado) {
		casilla.classList.add("dorado");
	}
	casilla.textContent = "🐛";
	estado.casillaBug = casilla;

	estado.temporizadorBug = setTimeout(aparecerBug, ritmoActual());
}

function mensajeFinal(puntos) {
	if (puntos >= 25) {
		return "🏆 Exterminador legendario";
	}
	if (puntos >= 15) {
		return "🎯 Cazador experto";
	}
	if (puntos >= 5) {
		return "🔦 Aprendiz de cazador";
	}
	return "🐛 Esta vez ganan los bugs";
}

// Para todos los temporizadores: ningun setTimeout ni setInterval sobrevive al final
function finDePartida() {
	estado.jugando = false;
	clearInterval(estado.reloj);
	clearTimeout(estado.temporizadorBug);
	esconderBug();

	if (estado.puntos > estado.record) {
		estado.record = estado.puntos;
	}
	actualizarMarcador();
	mensaje.textContent = `${mensajeFinal(estado.puntos)}: ${estado.puntos} puntos`;
	botonJugar.disabled = false;
}

function avanzarReloj() {
	estado.tiempo--;
	actualizarMarcador();
	if (estado.tiempo <= 0) {
		finDePartida();
	}
}

function jugar() {
	// El boton se desactiva, pero se comprueba igual por si llega un segundo clic
	if (estado.jugando) {
		return;
	}
	estado.jugando = true;
	estado.puntos = 0;
	estado.tiempo = DURACION;
	mensaje.textContent = "";
	botonJugar.disabled = true;
	actualizarMarcador();

	estado.reloj = setInterval(avanzarReloj, 1000);
	aparecerBug();
}

// Delegacion: un solo listener para las 9 casillas
tablero.addEventListener("click", (event) => {
	const casilla = event.target.closest(".casilla");
	if (!casilla || !estado.jugando) {
		return;
	}

	if (casilla === estado.casillaBug) {
		const esDorado = casilla.classList.contains("dorado");
		estado.puntos += esDorado ? PUNTOS_DORADO : PUNTOS_BUG;
		esconderBug();
	} else {
		estado.puntos = Math.max(0, estado.puntos - 1);
	}
	actualizarMarcador();
});

botonJugar.addEventListener("click", jugar);

crearTablero();
actualizarMarcador();
