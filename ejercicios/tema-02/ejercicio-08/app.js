// Prediccion antes de ejecutar: 1, 5, 7, 3, 6, 2
// - 1, 5 y 7 son codigo normal: se ejecutan de arriba abajo sin que nada los interrumpa
// - 3 y 6 van a la cola de promesas (microtareas), que se vacia en cuanto acaba el codigo normal
// - 2 va a la cola de temporizadores (macrotareas), que se mira la ultima aunque el tiempo sea 0

async function tarea() {
	// hasta el primer await una funcion async se ejecuta como una normal
	console.log("5");
	// el await corta la funcion: lo de debajo se apunta en la cola de promesas
	await Promise.resolve();
	console.log("6");
}

console.log("1");

// setTimeout no ejecuta nada ahora: apunta el callback en la cola de temporizadores
setTimeout(() => console.log("2"), 0);

// el .then tampoco se ejecuta ahora: va a la cola de promesas
Promise.resolve().then(() => console.log("3"));

// se llama sin await, asi que este codigo no espera a que tarea termine
tarea();

console.log("7");

// El 3 sale antes que el 6 porque entro antes en la cola de promesas (es una fila, por orden de llegada).
// El 2 se apunto el primero de todos pero sale el ultimo: las promesas tienen prioridad sobre los temporizadores
