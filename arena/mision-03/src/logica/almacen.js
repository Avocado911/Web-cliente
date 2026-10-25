// Lectura y escritura en localStorage sin que un dato corrupto o un almacenamiento
// bloqueado rompa la aplicacion

export function leer(clave, porDefecto) {
	try {
		const texto = localStorage.getItem(clave);
		return texto === null ? porDefecto : JSON.parse(texto);
	} catch {
		return porDefecto;
	}
}

export function guardar(clave, valor) {
	try {
		localStorage.setItem(clave, JSON.stringify(valor));
	} catch {
		// Almacenamiento lleno o desactivado: la app sigue funcionando sin guardar
	}
}
