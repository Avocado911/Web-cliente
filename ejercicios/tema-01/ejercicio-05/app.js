function clasificarNota(nota) {
	switch (true) {
		case (nota >= 0 && nota < 5):
			return "Suspenso";

		case (nota >= 5 && nota < 7):
			return "Aprobado";

		case (nota >= 7 && nota < 9):
			return "Notable";

		case (nota >= 9 && nota <= 10):
			return "Sobresaliente";

		default:
			return "Lo que has introducido no es valido";
	}
}

const nota = Number(prompt("Introduce la nota"));
console.log(clasificarNota(nota));

console.log(clasificarNota(4.9)); // Suspenso
console.log(clasificarNota(5));   // Aprobado
console.log(clasificarNota(7));   // Notable
console.log(clasificarNota(9));   // Sobresaliente
console.log(clasificarNota(10));  // Sobresaliente
console.log(clasificarNota(-3));  // no valido
console.log(clasificarNota(11));  // no valido
