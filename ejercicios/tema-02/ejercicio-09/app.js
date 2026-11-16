const URL_USERS = "https://jsonplaceholder.typicode.com/users";

async function getUserNames(url) {
	try {
		// primer await: llega la cabecera (codigo de estado), el cuerpo todavia no
		const respuesta = await fetch(url);

		// un 404 o un 500 no hacen saltar el catch: para fetch es una respuesta que llego bien.
		// Por eso se comprueba ok a mano y se lanza el error
		if (!respuesta.ok) {
			throw new Error(`HTTP ${respuesta.status}`);
		}

		// segundo await: baja el cuerpo y lo convierte de texto JSON a un array de objetos
		const users = await respuesta.json();

		// de cada usuario solo interesa el nombre
		return users.map(user => user.name);
	} catch (error) {
		// aqui caen los dos fallos: sin red (lo lanza fetch) y codigo malo (lo lanzo yo arriba)
		console.log("No se pudieron cargar los usuarios:", error.message);
		// array vacio para que quien llame pueda seguir usando map o length sin romperse
		return [];
	}
}

async function main() {
	// con await: no se pasa a la linea siguiente hasta tener los nombres
	const names = await getUserNames(URL_USERS);
	console.log("nombres:", names);

	// misma funcion con una ruta que no existe: el servidor contesta 404 y devuelve []
	const wrong = await getUserNames("https://jsonplaceholder.typicode.com/no-existe");
	console.log("con 404:", wrong);
}

main();
