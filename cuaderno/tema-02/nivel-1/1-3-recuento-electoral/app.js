const votos = ["Ana", "Luis", "Ana", "Sara", "Luis", "Ana", "Sara", "Ana"];

function escrutinio(votos) {
	// candidatos: el Set quita los nombres repetidos y el spread lo vuelca en un array
	const candidatos = [...new Set(votos)];

	// recuento: Map nombre -> votos. La primera vez get da undefined y el ?? 0 hace que parta de 0
	const recuento = new Map();
	for (const nombre of votos) {
		recuento.set(nombre, (recuento.get(nombre) ?? 0) + 1);
	}

	// ganadora: se recorren los pares [nombre, total] guardando el maximo visto hasta ahora.
	// Con > (y no >=) en caso de empate se queda la que llego primero a ese numero
	let ganadora = null;
	let maximo = 0;
	for (const [nombre, total] of recuento) {
		if (total > maximo) {
			maximo = total;
			ganadora = nombre;
		}
	}

	return { candidatos, recuento, ganadora };
}

const { candidatos, recuento, ganadora } = escrutinio(votos);

console.log("candidatos ->", candidatos);
console.log("recuento   ->", recuento);
console.log("ganadora   ->", ganadora);
