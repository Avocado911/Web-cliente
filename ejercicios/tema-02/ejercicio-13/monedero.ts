// Ejercicio 13: el monedero del ejercicio 5 pasado a TypeScript
// Los tipos solo existen al escribir y compilar: al ejecutar se borran y queda el mismo JS del ej. 5

// interface = la "forma" del objeto que devuelve la factory, como un struct de C pero solo para comprobar
interface Monedero {
	ingresar(n: number): void; // void: no devuelve nada, igual que en C
	retirar(n: number): void;
	consultar(): number;
}

// se anota lo que cruza fronteras: el parametro de entrada y lo que se devuelve
function crearMonedero(saldoInicial: number): Monedero {
	// saldo no se anota: TS deduce number porque saldoInicial es number (inferencia)
	let saldo = saldoInicial;

	return {
		ingresar(n) {
			// n no hace falta anotarlo aqui: TS ya lo sabe por la interface Monedero
			saldo += n;
		},
		retirar(n) {
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

try {
	monedero.retirar(500);
} catch (error) {
	// en TS lo que llega al catch es de tipo unknown (podria ser cualquier cosa, no solo un Error)
	// asi que hay que comprobarlo antes de leer .message
	if (error instanceof Error) console.log("error ->", error.message);
}

// ERRORES PROVOCADOS A PROPOSITO: quitar el // de una linea y ejecutar `npm run check`
// (o mirar el subrayado rojo en el editor)

// monedero.ingresar("50");
// -> error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
//    En el ej. 5 (JS) esto no avisaba: saldo pasaba a ser el texto "15050" sin ningun error

// console.log(monedero.saldo);
// -> error TS2339: Property 'saldo' does not exist on type 'Monedero'.
//    En JS daba undefined en silencio; aqui el editor dice que esa propiedad no existe

// const texto: string = monedero.consultar();
// -> error TS2322: Type 'number' is not assignable to type 'string'.
