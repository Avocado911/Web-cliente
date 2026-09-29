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
