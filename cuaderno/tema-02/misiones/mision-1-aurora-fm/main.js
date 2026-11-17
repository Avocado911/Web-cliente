// Demo de la mision 1: abrir index.html con Live Server y mirar la consola (F12)
import {
	cancionesIniciales,
	agregar,
	eliminar,
	alternarFavorita,
	duracionTotal,
	ordenarPor,
	porGenero,
	crearInstantanea,
	guardar,
	cargar,
	crearHistorial,
	aplicar,
	deshacer,
	buscar,
} from "./playlist.js";

// foto en texto del original ANTES de nada, para comparar al final
const antes = JSON.stringify(cancionesIniciales);

console.log("--- Fase 1: operaciones basicas ---");
// se encadenan: cada paso recibe el array nuevo del anterior
const lista = alternarFavorita(
	eliminar(agregar(cancionesIniciales, { titulo: "Enjoy the Silence", artista: "Depeche Mode", genero: "synthpop", duracion: 252 }), 3),
	1,
);
console.table(lista);

console.log("--- Fase 2: consultas ---");
console.log("duracion total de las iniciales ->", duracionTotal(cancionesIniciales)); // "21:25"
console.log("ordenadas por duracion ->", ordenarPor(cancionesIniciales, "duracion").map((c) => c.titulo));
console.log("ordenadas por titulo ->", ordenarPor(cancionesIniciales, "titulo").map((c) => c.titulo));
console.log("por genero ->", porGenero(cancionesIniciales));

console.log("--- Fase 3: instantaneas ---");
const copiaPlana = [...cancionesIniciales];
const instantanea = crearInstantanea(cancionesIniciales);
instantanea[0].titulo = "CAMBIADA EN LA INSTANTANEA";
console.log("original tras tocar la instantanea ->", cancionesIniciales[0].titulo); // sigue "Midnight City"
// con spread el array es otro, pero los objetos de dentro son los mismos: comparten referencia
console.log("copia con spread, mismo objeto dentro? ->", copiaPlana[0] === cancionesIniciales[0]); // true
console.log("instantanea, mismo objeto dentro? ->", instantanea[0] === cancionesIniciales[0]); // false

console.log("--- Ninguna funcion ha mutado el original ---");
console.log("original igual que al principio? ->", JSON.stringify(cancionesIniciales) === antes); // true

console.log("--- Fase 4: persistencia ---");
guardar(lista);
console.log("cargado de localStorage ->", cargar().map((c) => c.titulo));
// basura a mano: cargar no puede romper
localStorage.setItem("aurora-fm", "{esto no es json");
console.log("con JSON corrupto ->", cargar().length, "canciones (las iniciales)");
guardar(lista); // se deja guardada la buena para verla en Application -> Local Storage

console.log("--- Extra: deshacer ---");
let historial = crearHistorial(cancionesIniciales);
historial = aplicar(historial, (l) => eliminar(l, 1));
historial = aplicar(historial, (l) => eliminar(l, 2));
console.log("tras borrar dos ->", historial.actual.length);
historial = deshacer(historial);
console.log("tras deshacer una ->", historial.actual.length);

console.log("--- Extra: buscar sin tildes ni mayusculas ---");
console.log('"gymnopedie" ->', buscar(cancionesIniciales, "gymnopedie").map((c) => c.titulo));
console.log('"QUEEN" ->', buscar(cancionesIniciales, "QUEEN").map((c) => c.titulo));
