const LETRAS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%&*?";
const LONGITUD_MINIMA = 4;
const LONGITUD_MAXIMA = 32;

const campoLongitud = document.querySelector("#longitud");
const casillaNumeros = document.querySelector("#usar-numeros");
const casillaSimbolos = document.querySelector("#usar-simbolos");
const botonForjar = document.querySelector("#forjar");
const salidaClave = document.querySelector("#clave");
const salidaTemple = document.querySelector("#temple");
const aviso = document.querySelector("#aviso");

// Funcion pura: solo depende de sus parametros y no toca el DOM
function forjarClave(longitud, usarNumeros, usarSimbolos) {
	let alfabeto = LETRAS;
	if (usarNumeros) {
		alfabeto += NUMEROS;
	}
	if (usarSimbolos) {
		alfabeto += SIMBOLOS;
	}

	let clave = "";
	for (let i = 0; i < longitud; i++) {
		const posicion = Math.floor(Math.random() * alfabeto.length);
		clave += alfabeto[posicion];
	}
	return clave;
}

// Un punto por cada material extra y otro por la longitud
function medirTemple(longitud, usarNumeros, usarSimbolos) {
	let puntos = 0;
	if (longitud >= 12) {
		puntos++;
	}
	if (usarNumeros) {
		puntos++;
	}
	if (usarSimbolos) {
		puntos++;
	}

	if (puntos <= 1) {
		return "debil";
	}
	if (puntos === 2) {
		return "aceptable";
	}
	return "legendaria";
}

function mostrarTemple(temple) {
	salidaTemple.classList.remove("debil", "aceptable", "legendaria");
	salidaTemple.classList.add(temple);
	salidaTemple.textContent = `Temple: ${temple}`;
}

function limpiarResultado() {
	salidaClave.textContent = "";
	salidaTemple.textContent = "";
	salidaTemple.classList.remove("debil", "aceptable", "legendaria");
}

botonForjar.addEventListener("click", () => {
	const longitud = Number(campoLongitud.value);

	if (campoLongitud.value === "" || longitud < LONGITUD_MINIMA || longitud > LONGITUD_MAXIMA) {
		limpiarResultado();
		aviso.textContent = `La longitud tiene que estar entre ${LONGITUD_MINIMA} y ${LONGITUD_MAXIMA}`;
		return;
	}

	const usarNumeros = casillaNumeros.checked;
	const usarSimbolos = casillaSimbolos.checked;

	aviso.textContent = "";
	salidaClave.textContent = forjarClave(longitud, usarNumeros, usarSimbolos);
	mostrarTemple(medirTemple(longitud, usarNumeros, usarSimbolos));
});
