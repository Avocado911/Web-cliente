// Demo de la mision 2: abrir index.html con Live Server y mirar la consola (F12)
// (tambien funciona con `node main.js`)
import {
	ErrorPokedex,
	obtenerPokemon,
	obtenerEquipo,
	obtenerEquipoSecuencial,
	obtenerEquipoSeguro,
	conTimeout,
	nombreEspecie,
	vaciarCache,
} from "./pokedex.js";

const EQUIPO = ["pikachu", "bulbasaur", "charmander", "squirtle", "eevee", "snorlax"];

// main entero dentro de try/catch: ningun error se queda como unhandled rejection
async function main() {
	console.log("--- Fase 1: consulta basica ---");
	console.log(await obtenerPokemon("pikachu"));

	console.log("--- Fase 2: errores con clase ---");
	try {
		await obtenerPokemon("misingno");
	} catch (error) {
		// instanceof distingue nuestros errores de cualquier otro (un TypeError de un bug, por ejemplo)
		if (error instanceof ErrorPokedex && error.codigo === 404) {
			console.log("404: ese Pokemon no existe ->", error.message);
		} else if (error instanceof ErrorPokedex && error.codigo === 0) {
			console.log("Sin conexion ->", error.message);
		} else {
			throw error;
		}
	}

	console.log("--- Fase 3: secuencial frente a paralelo ---");
	vaciarCache();
	console.time("secuencial");
	await obtenerEquipoSecuencial(EQUIPO);
	console.timeEnd("secuencial");

	vaciarCache(); // sin esto el paralelo haria trampa: todo vendria de la cache
	console.time("paralelo");
	const equipo = await obtenerEquipo(EQUIPO);
	console.timeEnd("paralelo");
	console.log(equipo.map((p) => `${p.nombre} (${p.tipos.join("/")})`).join(", "));
	// Medido el 2026-11-17 con 6 Pokemon: secuencial 456 ms, paralelo 99 ms (unas 4-5 veces mas rapido)

	console.log("--- Fase 4: tolerante a fallos ---");
	const { capturados, escapados } = await obtenerEquipoSeguro(["pikachu", "misingno", "eevee"]);
	console.log("capturados ->", capturados.map((p) => p.nombre));
	console.log("escapados ->", escapados);

	console.log("--- Fase 5: timeout con cualquier promesa ---");
	const lenta = new Promise((resolve) => setTimeout(() => resolve("tarde"), 2000));
	try {
		await conTimeout(lenta, 500);
	} catch (error) {
		console.log("promesa normal ->", error.message);
	}
	console.log("rapida ->", await conTimeout(Promise.resolve("a tiempo"), 500));

	console.log("--- Extra: cache ---");
	console.time("pikachu otra vez (cache)");
	await obtenerPokemon("pikachu");
	console.timeEnd("pikachu otra vez (cache)");

	console.log("--- Extra: Promise.any ---");
	console.log(await nombreEspecie("pikachu"));
}

main().catch((error) => console.error("Error inesperado:", error));
