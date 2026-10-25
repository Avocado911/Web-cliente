import Portada from "./Portada.jsx";

// Une los datos que existan con " · " y se salta los que faltan
export function textoDetalles(libro) {
	return [libro.anio ?? "Año desconocido", libro.paginas ? `${libro.paginas} pags.` : null]
		.filter((dato) => dato !== null)
		.join(" · ");
}

export default function TarjetaLibro({ libro, marcado, onAlternarFavorito }) {
	return (
		<article className="libro">
			<Portada libro={libro} />
			<h3>{libro.titulo}</h3>
			<p className="autores">{libro.autores.join(", ")}</p>
			<p className="detalles">{textoDetalles(libro)}</p>
			<button
				type="button"
				className="boton-favorito"
				aria-pressed={marcado}
				aria-label={marcado ? "Quitar de la estanteria" : "Guardar en la estanteria"}
				onClick={() => onAlternarFavorito(libro)}
			>
				{marcado ? "★" : "☆"}
			</button>
		</article>
	);
}
