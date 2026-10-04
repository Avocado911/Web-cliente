function crearEntrada(nombre, evento, precio = 15) {
	return `=============================
 🎟️ ${evento}
 Asistente: ${nombre}
 Precio final: ${precio * 1.1} €
=============================`;
}

console.log(crearEntrada("Ada Lovelace", "JS FEST 2026"));
console.log(crearEntrada("Alan Turing", "JS FEST 2026", 20));
