const puntuaciones = [880, 1250, 445, 990, 1250, 720];

// (a) podio: el Set quita el 1250 repetido y el spread lo vuelca en un array nuevo,
// asi toSorted y slice trabajan sobre esa copia y no sobre puntuaciones
const podio = [...new Set(puntuaciones)].toSorted((a, b) => b - a).slice(0, 3);

// (b) corregidas: Math.min no acepta un array, por eso se le pasan los numeros sueltos con spread.
// with devuelve un array nuevo con esa posicion cambiada, no toca el original
const minima = Math.min(...puntuaciones);
const indiceMinima = puntuaciones.indexOf(minima);
const corregidas = puntuaciones.with(indiceMinima, 500);

console.log("podio      ->", podio);
console.log("corregidas ->", corregidas);
console.log("original   ->", puntuaciones);

// corregidas es otra caja distinta, por eso el original sigue igual
console.log("son el mismo array:", corregidas === puntuaciones);
