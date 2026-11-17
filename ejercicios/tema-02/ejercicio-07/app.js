const palabras = ["sol", "luna", "sol", "mar", "luna", "sol", "rio"];

// Map para contar: la clave es la palabra y el valor las veces que ha salido
const conteo = new Map();
for (const palabra of palabras) {
	// get devuelve undefined la primera vez que sale la palabra, por eso el ?? 0
	conteo.set(palabra, (conteo.get(palabra) ?? 0) + 1);
}

// Set para las unicas: los repetidos se descartan solos al construirlo
const unicas = new Set(palabras);

console.log("conteo ->", conteo);
console.log("unicas ->", [...unicas]);

// en un Map se lee con get y el tamano es size (propiedad, sin parentesis)
console.log("veces que sale sol ->", conteo.get("sol"));
console.log("palabras distintas ->", conteo.size, "| unicas.size ->", unicas.size);

// un Map se recorre en orden de insercion y cada vuelta da el par [clave, valor]
for (const [palabra, veces] of conteo) {
	console.log(`${palabra}: ${veces}`);
}

// has contesta si algo esta sin tener que recorrer nada
console.log("esta mar ->", unicas.has("mar"), "| esta lago ->", unicas.has("lago"));
