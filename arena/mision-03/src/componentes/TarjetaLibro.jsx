import Portada from "./Portada.jsx";
import { textoDetalles } from "../logica/datos.js";

export default function TarjetaLibro({ libro, marcado, onAlternarFavorito, onAbrir }) {
	return (
		<article className="libro">
			<Portada libro={libro} />
			<h3>
				<button type="button" className="abrir-detalle" onClick={() => onAbrir(libro)}>{libro.titulo}</button>
			</h3>
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
