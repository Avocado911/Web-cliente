# 1.4 El oraculo del event loop

Nivel 1 · Calentamiento · 15 min · sin IA

## Enunciado

Sin ejecutarlo, escribe el orden exacto de salida. Despues ejecutalo y compara. Si fallas, explica por escrito que cola (sincrona, microtareas o macrotareas) habias colocado mal.

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve()
	.then(() => console.log("C"))
	.then(() => console.log("D"));
setTimeout(() => console.log("E"), 0);
console.log("F");
```

La salida esperada esta al final de este archivo: no la mires hasta haberlo escrito.

Logro "Oraculo asincrono": acertar sin ejecutar.

&nbsp;

&nbsp;

&nbsp;

<details>
<summary>Salida esperada</summary>

`A F C D B E`. Primero se vacia la call stack (todo lo sincrono), despues todas las microtareas (incluidas las que otras microtareas encolan, como el segundo `.then`) y solo entonces las macrotareas, en su orden de llegada.

</details>
