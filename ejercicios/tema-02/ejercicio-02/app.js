const productos = [
	{ nombre: "Teclado", precio: 25, stock: 0 },
	{ nombre: "Raton", precio: 15, stock: 12 },
	{ nombre: "Monitor", precio: 180, stock: 4 },
];

const salida = productos.filter(p => p.stock > 0).map(p => p.nombre.toUpperCase()).toSorted();
console.log(salida);
