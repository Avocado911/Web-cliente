// Demo de la mision 3: `npm run dev`, abrir http://localhost:5173 y mirar la pagina y la consola
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
} from "./playlist";
import { ultima } from "./utilidades";
import type { Cancion } from "./tipos";

// la lista que se usa: la guardada si cargar() sale bien, y si no las iniciales
const resultado = cargar();
// resultado.valor aqui daria error: TS no deja leerlo sin comprobar antes ok (union discriminada)
const lista: Cancion[] = resultado.ok ? resultado.valor : crearInstantanea(cancionesIniciales);
if (!resultado.ok) console.info("cargar():", resultado.error, "-> se usan las iniciales");

const nueva = alternarFavorita(
	eliminar(agregar(lista, { titulo: "Enjoy the Silence", artista: "Depeche Mode", genero: "synthpop", duracion: 252 }), 3),
	1,
);
guardar(nueva);

console.log("duracion total de las iniciales ->", duracionTotal(cancionesIniciales)); // "21:25"
console.log("por duracion ->", ordenarPor(nueva, "duracion").map((c) => c.titulo));
console.log("por genero ->", porGenero(nueva));

// el generico con dos tipos distintos
const ultimaCancion = ultima(nueva); // Cancion | undefined
const ultimoGenero = ultima(["clasica", "rock", "synthpop"]); // string | undefined
// ?. porque las dos pueden ser undefined (lista vacia): sin el ?. TS marca error
console.log("ultima cancion ->", ultimaCancion?.titulo, "| ultimo genero ->", ultimoGenero?.toUpperCase());

// pinta la lista en la pagina
const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
	app.innerHTML = `
		<h1>Aurora FM</h1>
		<p>Duracion total: ${duracionTotal(nueva)}</p>
		<ul>
			${nueva.map((c) => `<li>${c.favorita ? "★ " : ""}${c.titulo} · ${c.artista}</li>`).join("")}
		</ul>
	`;
}

// ---------- Fase 4: errores provocados a proposito ----------
// Quitar el // de una linea: el editor la subraya en rojo y `npm run build` se para.
// Mensajes exactos de tsc (TypeScript 7.0):

// ordenarPor(nueva, "precio");
// -> error TS2345: Argument of type '"precio"' is not assignable to parameter of type 'CampoOrden'.

// nueva[0].id = 99;
// -> error TS2540: Cannot assign to 'id' because it is a read-only property.

// const sinDuracion: Cancion = { id: 9, titulo: "Sin tiempo", artista: "Nadie", genero: "rock", favorita: false };
// -> error TS2741: Property 'duracion' is missing in type '{ id: number; titulo: string; artista: string; genero: string; favorita: false; }' but required in type 'Cancion'.
