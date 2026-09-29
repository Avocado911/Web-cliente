const SIMBOLOS = ["🔮", "🌙", "⭐", "🪐", "🧿", "🦉", "💎", "🌌"];

const tablero = document.querySelector("#tablero");
const marcadorMovimientos = document.querySelector("#movimientos");
const marcadorParejas = document.querySelector("#parejas");
const mensaje = document.querySelector("#mensaje");
const botonReiniciar = document.querySelector("#reiniciar");

const estado = {
	primera: null,
	segunda: null,
	bloqueado: false,
	movimientos: 0,
	parejas: 0,
};

function crearCarta(simbolo) {
	const carta = document.createElement("button");
	carta.classList.add("carta");
	carta.dataset.simbolo = simbolo;
	carta.textContent = "?";
	return carta;
}

function barajarCartas(lista) {
	const copia = [...lista];
	for (let i = copia.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = copia[i];
		copia[i] = copia[j];
		copia[j] = tmp;
	}
	return copia;
}

function repartirCartas() {
	tablero.replaceChildren();
	const baraja = barajarCartas([...SIMBOLOS, ...SIMBOLOS]);
	for (const simbolo of baraja) {
		tablero.append(crearCarta(simbolo));
	}
}

function girarCarta(carta) {
	carta.textContent = carta.dataset.simbolo;
	carta.classList.add("girada");
}

function ocultarCarta(carta) {
	carta.classList.remove("girada");
	carta.textContent = "?";
}

function limpiarSeleccion() {
	estado.primera = null;
	estado.segunda = null;
	estado.bloqueado = false;
}

function comprobarPareja() {
	if (estado.primera.dataset.simbolo === estado.segunda.dataset.simbolo) {

		estado.primera.classList.add("emparejada");
		estado.segunda.classList.add("emparejada");
		estado.primera.disabled = true;
		estado.segunda.disabled = true;
		estado.parejas++;
		limpiarSeleccion();

	} else {
		estado.bloqueado = true;
		setTimeout(() => {
			ocultarCarta(estado.primera);
			ocultarCarta(estado.segunda);
			limpiarSeleccion();
		}, 900);
	}

}





tablero.addEventListener("click", (event) => {
	const carta = event.target.closest(".carta");
	if (!carta || carta.classList.contains("girada") || estado.bloqueado) return;
	girarCarta(carta);
	if (!estado.primera) {
		estado.primera = carta;
		return;
	}
	estado.segunda = carta;
	estado.movimientos++;
	comprobarPareja();
});



repartirCartas();
