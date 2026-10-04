function precioFinal(precio, descuento) {
	if (precio < 0) {
		return "Precio no valido";
	}
	// Con ?? un descuento de 0 se respeta; con || se trataria igual que si no hubiera descuento
	const porcentaje = descuento ?? 0;
	return precio - precio * porcentaje / 100;
}

console.log(precioFinal(100, 25)); // 75
console.log(precioFinal(100, 0));  // 100
console.log(precioFinal(100));     // 100
console.log(precioFinal(-5, 10));  // "Precio no valido"
