// Prediccion escrita antes de ejecutar: A F C D B E
// 1. Codigo normal, de arriba abajo: A y F
// 2. Cola de promesas (microtareas): C. Al ejecutarse C, su .then siguiente (D) entra en la misma cola,
//    y esa cola se vacia entera antes de pasar a otra cosa, por eso D sale antes que B
// 3. Cola de temporizadores (macrotareas), por orden de llegada: B y E

console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve()
	.then(() => console.log("C"))
	.then(() => console.log("D"));
setTimeout(() => console.log("E"), 0);
console.log("F");
