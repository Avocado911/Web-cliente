const number = 1;
const string = "hola gente";
const bign = 9007199254740993n;
const boleeean = true;
let unde;
const simbolo = Symbol("hola?");
const nulo = null;

console.log(number, typeof number);
console.log(string, typeof string);
console.log(bign, typeof bign);
console.log(boleeean, typeof boleeean);
console.log(unde, typeof unde);
console.log(simbolo, typeof simbolo);

// typeof null es "object": es un bug histórico de JS desde 1995 que nunca
// se corrigió por compatibilidad hacia atrás.

console.log(nulo, typeof nulo);

