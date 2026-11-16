// json-server escribe en el fichero que sirve. Para no ensuciar el repositorio con cada alta,
// se sirve una copia (db.json, fuera de git) y la semilla se queda intacta.
// Con --forzar se vuelve a los datos de partida.
import { copyFileSync, existsSync } from "node:fs";

const semilla = new URL("./semilla.json", import.meta.url);
const copia = new URL("./db.json", import.meta.url);
const forzar = process.argv.includes("--forzar");

if (forzar || !existsSync(copia)) {
	copyFileSync(semilla, copia);
	console.log("Datos de partida copiados a datos/db.json");
}
