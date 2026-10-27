import { useEffect, useRef } from "react";
import Portada from "./Portada.jsx";
import { useDetalleLibro } from "../hooks/useDetalleLibro.js";
import { textoDetalles } from "../logica/datos.js";

// Lo que puede recibir el foco con Tab dentro del dialogo
const ENFOCABLES = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
	const dialogo = useRef(null);
	const botonCerrar = useRef(null);

	// Al abrir, el foco va al boton de cerrar para poder manejarlo con teclado.
	// Se apunta quien tenia el foco (el boton que abrio la ficha) y al cerrar se le devuelve
	useEffect(() => {
		const anterior = document.activeElement;
		botonCerrar.current.focus();
		return () => anterior?.focus();
	}, []);

	// Escape cierra el detalle y Tab no sale de el (trampa de foco).
	// El listener es del documento, fuera de React: hay que quitarlo
	useEffect(() => {
		function alPulsarTecla(event) {
			if (event.key === "Escape") {
				onCerrar();
				return;
			}
			if (event.key !== "Tab") {
				return;
			}
			const enfocables = dialogo.current.querySelectorAll(ENFOCABLES);
			const primero = enfocables[0];
			const ultimo = enfocables[enfocables.length - 1];
			// Desde el ultimo, Tab vuelve al primero; desde el primero, Shift+Tab va al ultimo.
			// Si el foco se ha escapado del dialogo (clic en el fondo), tambien vuelve dentro
			const fuera = !dialogo.current.contains(document.activeElement);
			if (event.shiftKey && (document.activeElement === primero || fuera)) {
				event.preventDefault();
				ultimo.focus();
			} else if (!event.shiftKey && (document.activeElement === ultimo || fuera)) {
				event.preventDefault();
				primero.focus();
			}
		}
		document.addEventListener("keydown", alPulsarTecla);
		return () => document.removeEventListener("keydown", alPulsarTecla);
	}, [onCerrar]);

	return (
		// Clic en el fondo (no en la ficha) tambien cierra
		<div className="fondo-detalle" onClick={(event) => event.target === event.currentTarget && onCerrar()}>
			<article ref={dialogo} className="detalle" role="dialog" aria-modal="true" aria-labelledby="titulo-detalle">
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
