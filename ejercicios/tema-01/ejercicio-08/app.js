function crearContador() {
	let cuenta = 0;
	return () => ++cuenta;
}

const a = crearContador();
const b = crearContador();

console.log(a()); // 1
console.log(a()); // 2
console.log(a()); // 3
console.log(b()); // 1 -> b tiene su propia cuenta, no comparte estado con a
console.log(a()); // 4
