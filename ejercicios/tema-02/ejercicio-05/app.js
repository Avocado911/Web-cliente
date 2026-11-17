// Factory: cada llamada crea su propia variable saldo y devuelve tres funciones que la recuerdan (closure)
function crearMonedero(saldoInicial) {
	// saldo es una variable local, no una propiedad del objeto: desde fuera no hay forma de tocarla
	let saldo = saldoInicial;

	return {
		ingresar(n) {
			saldo += n;
		},
		retirar(n) {
			// se comprueba antes de restar, asi el saldo nunca llega a quedar en negativo
			if (n > saldo) {
				throw new Error(`Saldo insuficiente: tienes ${saldo} y quieres retirar ${n}`);
			}
			saldo -= n;
		},
		consultar() {
			return saldo;
		},
	};
}

const monedero = crearMonedero(100);
monedero.ingresar(50);
monedero.retirar(30);
console.log("saldo ->", monedero.consultar());

// el saldo es privado: no es una propiedad, es una variable escondida en el closure
console.log("monedero.saldo ->", monedero.saldo);

// esto no cambia el saldo de verdad: le pega al objeto una propiedad nueva que nadie usa
monedero.saldo = 0;
console.log("tras monedero.saldo = 0 ->", monedero.consultar());

// retirar de mas lanza un Error y el saldo se queda como estaba
try {
	monedero.retirar(500);
} catch (error) {
	console.log("error ->", error.message);
}
console.log("saldo tras el error ->", monedero.consultar());

// cada llamada a la factory crea un saldo distinto: los monederos son independientes
const otro = crearMonedero(10);
otro.ingresar(5);
console.log("otro ->", otro.consultar(), "| el primero sigue en ->", monedero.consultar());
