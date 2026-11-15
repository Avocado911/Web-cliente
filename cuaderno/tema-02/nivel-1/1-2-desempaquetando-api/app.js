const respuesta = {
	data: {
		usuario: {
			nombre: "Rio", nivel: 12,
			stats: { victorias: 40, derrotas: 5 },
		},
		amigos: ["Vega", "Kai", "Nova"],
	},
};

// Una sola sentencia. Lo que lleva dos puntos y llaves (data, usuario, stats) solo es el camino
// para llegar dentro: no crea variable. Las variables que se crean son las del final de cada rama:
// - nombre: campo nombre -> variable nombre
// - victorias: wins -> campo victorias, variable wins
// - rango = "novato" -> el campo no existe (undefined), asi que se queda el valor por defecto
// - amigos: [mejorAmigo, ...resto] -> la posicion 0 y el resto recogido en un array
const {
	data: {
		usuario: {
			nombre,
			rango = "novato",
			stats: { victorias: wins },
		},
		amigos: [mejorAmigo, ...resto],
	},
} = respuesta;

console.log(`${nombre} · wins: ${wins} · rango: ${rango} · mejor amigo: ${mejorAmigo} · resto: ${JSON.stringify(resto)}`);

// respuesta no cambia: desestructurar solo crea variables sueltas
console.log("amigos sigue igual:", respuesta.data.amigos);
