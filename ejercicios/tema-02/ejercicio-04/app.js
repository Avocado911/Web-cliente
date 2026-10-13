const config = { idioma: "es", tema: { color: "morado" } };

const copiaSpread = { ...config };
const copiaProfunda = structuredClone(config);

copiaSpread.idioma = "en";
copiaSpread.tema.color = "rojo";
copiaProfunda.tema.color = "verde";

// El spread solo copia el primer nivel: idioma es un string y se copia, pero tema
// es un objeto y se copia la referencia, asi que copiaSpread y config comparten el mismo tema
console.log("config.idioma:", config.idioma);
console.log("config.tema.color:", config.tema.color);
console.log("copiaSpread.tema.color:", copiaSpread.tema.color);

// structuredClone copia tambien los objetos anidados: copiaProfunda tiene su propio tema
console.log("copiaProfunda.tema.color:", copiaProfunda.tema.color);

console.log("comparten tema config y copiaSpread:", config.tema === copiaSpread.tema);
console.log("comparten tema config y copiaProfunda:", config.tema === copiaProfunda.tema);

// Sin structuredClone: spread anidado, se crea un tema nuevo solo para la parte que cambia
const original = { idioma: "es", tema: { color: "morado" } };
const actualizada = { ...original, tema: { ...original.tema, color: "azul" } };
console.log("original.tema.color:", original.tema.color);
console.log("actualizada.tema.color:", actualizada.tema.color);
