// El oraculo elige su numero secreto
const secreto = Math.floor(Math.random() * 100) + 1;

const numero = document.querySelector("#numero");
const botonConsultar = document.querySelector("#consultar");
const respuesta = document.querySelector("#respuesta");
const marcadorIntentos = document.querySelector("#intentos");

let contador = 0;

botonConsultar.addEventListener("click", () => {
	if (numero.value === "") {
		respuesta.textContent = "Lo que has puesto no es valido";
		return;
	}

	const intento = Number(numero.value);
	if (intento < 1 || intento > 100) {
		respuesta.textContent = "Introduce un numero dentro del rango 1-100";
		return;
	}
	contador++;
	marcadorIntentos.textContent = contador;

	if (intento === secreto) {
		respuesta.textContent = `Perfecto, has acertado en ${contador} intentos`;
		botonConsultar.disabled = true;

	} else if (intento > secreto) {
		respuesta.textContent = "JAJAJ estas por encima";

	} else {
		respuesta.textContent = "Rey, un poquito mas alto";
	}

});
