// Traduce el estado de la busqueda a un texto; el tipo decide el estilo en el CSS
function elegirMensaje({ estado, busqueda, error, totalLibros, totalVisibles }) {
	switch (estado) {
		case "inicio":
			return { tipo: "inicio", texto: "Busca un titulo o un autor para explorar la biblioteca." };
		case "cargando":
			return { tipo: "cargando", texto: `Consultando los archivos en busca de "${busqueda}"...` };
		case "error":
			return { tipo: "error", texto: error };
		default:
			if (totalLibros === 0) {
				return { tipo: "vacio", texto: `No hay ningun libro que coincida con "${busqueda}".` };
			}
			if (totalVisibles === 0) {
				return { tipo: "vacio", texto: "Ningun libro cumple los filtros elegidos." };
			}
			return { tipo: "datos", texto: `${totalVisibles} libros encontrados` };
	}
}

export default function Mensaje({ onReintentar, ...datos }) {
	const { tipo, texto } = elegirMensaje(datos);
	return (
		<p className="mensaje" data-tipo={tipo} aria-live="polite">
			{texto}
			{tipo === "error" && (
				<button type="button" className="boton boton-pequeno" onClick={onReintentar}>Reintentar</button>
			)}
		</p>
	);
}
