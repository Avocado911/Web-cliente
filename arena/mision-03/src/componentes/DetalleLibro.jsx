import { useEffect, useRef } from "react";
import Portada from "./Portada.jsx";
import { textoDetalles } from "./TarjetaLibro.jsx";
import { useDetalleLibro } from "../hooks/useDetalleLibro.js";

function ContenidoDetalle({ estado, detalle, error }) {
	if (estado === "cargando") {
		return <p className="detalles">Buscando la ficha en los archivos...</p>;
	}
	if (estado === "error") {
		return <p className="error-detalle">{error}</p>;
	}
	return (
		<>
			<p className="descripcion">{detalle.descripcion ?? "Esta obra no tiene descripcion en OpenLibrary."}</p>
			{detalle.temas.length > 0 && (
				<ul className="temas">
					{detalle.temas.map((tema) => <li key={tema}>{tema}</li>)}
				</ul>
			)}
		</>
	);
}

export default function DetalleLibro({ libro, marcado, onAlternarFavorito, onCerrar }) {
	const ficha = useDetalleLibro(libro.id);
	const botonCerrar = useRef(null);

	// Al abrir, el foco va al boton de cerrar para poder manejarlo con teclado
	useEffect(() => {
		botonCerrar.current.focus();
	}, []);

	// Escape cierra el detalle. El listener es del documento, fuera de React: hay que quitarlo
	useEffect(() => {
		function alPulsarTecla(event) {
			if (event.key === "Escape") {
				onCerrar();
			}
		}
		document.addEventListener("keydown", alPulsarTecla);
		return () => document.removeEventListener("keydown", alPulsarTecla);
	}, [onCerrar]);

	return (
		// Clic en el fondo (no en la ficha) tambien cierra
		<div className="fondo-detalle" onClick={(event) => event.target === event.currentTarget && onCerrar()}>
			<article className="detalle" role="dialog" aria-modal="true" aria-labelledby="titulo-detalle">
				<button ref={botonCerrar} type="button" className="cerrar-detalle" aria-label="Cerrar detalle" onClick={onCerrar}>
					✕
				</button>
				<Portada libro={libro} grande />
				<div className="cuerpo-detalle">
					<h2 id="titulo-detalle">{libro.titulo}</h2>
					<p className="autores">{libro.autores.join(", ")}</p>
					<p className="detalles">{textoDetalles(libro)}</p>
					<ContenidoDetalle {...ficha} />
					<button type="button" className="boton" onClick={() => onAlternarFavorito(libro)}>
						{marcado ? "★ Quitar de la estanteria" : "☆ Guardar en la estanteria"}
					</button>
				</div>
			</article>
		</div>
	);
}
