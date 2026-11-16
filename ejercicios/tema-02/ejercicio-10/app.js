// new Promise crea una promesa a mano. Recibe una funcion con dos parametros:
// resolve(valor) la cumple y reject(error) la rechaza. Aqui se llama dentro de un setTimeout
// para simular una peticion que tarda
function fast() {
	return new Promise(resolve => setTimeout(() => resolve("rapida"), 100));
}

function medium() {
	return new Promise((resolve, reject) => setTimeout(() => reject(new Error("media rota")), 200));
}

function slow() {
	return new Promise(resolve => setTimeout(() => resolve("lenta"), 300));
}

async function main() {
	// all: espera a todas, pero en cuanto una rechaza lanza ese error
	// y se pierden los resultados de las que si fueron bien
	try {
		const results = await Promise.all([fast(), medium(), slow()]);
		console.log("all:", results);
	} catch (error) {
		console.log("all falla:", error.message);
	}

	// allSettled: nunca lanza. Espera a las tres y da un informe de cada una:
	// status "fulfilled" con value, o status "rejected" con reason
	const report = await Promise.allSettled([fast(), medium(), slow()]);
	for (const item of report) {
		if (item.status === "fulfilled") {
			console.log("allSettled bien:", item.value);
		} else {
			console.log("allSettled mal:", item.reason.message);
		}
	}

	// race: gana la primera que termine, sea bien o mal. Aqui gana fast (100 ms)
	const winner = await Promise.race([fast(), medium(), slow()]);
	console.log("race:", winner);

	// si la mas rapida es la que rechaza, race rechaza
	try {
		await Promise.race([medium(), slow()]);
	} catch (error) {
		console.log("race falla:", error.message);
	}
}

main();
