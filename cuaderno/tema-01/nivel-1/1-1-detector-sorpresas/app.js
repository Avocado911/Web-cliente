// "10" + 5 -> "105": con un string, + concatena (el 5 se convierte a texto)
console.log("10" + 5);

// "10" - 5 -> 5: - solo sirve para numeros, asi que "10" se convierte a 10
console.log("10" - 5);

// 10 == "10" -> true: == convierte los tipos antes de comparar
console.log(10 == "10");

// 10 === "10" -> false: === compara tipo y valor, number no es string
console.log(10 === "10");

// true + true -> 2: en una suma true se convierte a 1
console.log(true + true);

// "" == false -> true: los dos se convierten a 0 antes de comparar
console.log("" == false);

// "" === false -> false: string y boolean son tipos distintos
console.log("" === false);

// null ?? "vacio" -> "vacio": ?? da el valor por defecto si es null o undefined
console.log(null ?? "vacio");

// 0 || "cero" -> "cero": 0 es falsy, asi que || devuelve el segundo
console.log(0 || "cero");

// 0 ?? "cero" -> 0: 0 no es null ni undefined, asi que ?? lo deja pasar
console.log(0 ?? "cero");
