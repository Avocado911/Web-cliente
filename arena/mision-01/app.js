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
