import { CARNES, SECCIONES, textoDe } from "../logica/catalogo.js";

const formatoFecha = new Intl.DateTimeFormat("es-ES", { dateStyle: "long" });

export default function TarjetaSocio({ socio, onBaja, dandoDeBaja }) {
	return (
		<li className="tarjeta">
			<div>
				<h3>{socio.nombre}</h3>
				<p className="tarjeta-carne">{textoDe(CARNES, socio.carne)}</p>
				<p>
					{socio.edad} años · {textoDe(SECCIONES, socio.seccion)}
					{socio.tutor && <> · tutor: {socio.tutor}</>}
				</p>
				{socio.motivo && <p className="tarjeta-motivo">«{socio.motivo}»</p>}
				<p className="tarjeta-alta">Socio desde el {formatoFecha.format(new Date(socio.alta))}</p>
			</div>
			<button type="button" className="boton boton-pequeno boton-baja" disabled={dandoDeBaja}
				onClick={() => onBaja(socio.id)} aria-label={`Dar de baja a ${socio.nombre}`}>
				{dandoDeBaja ? "Dando de baja…" : "Dar de baja"}
			</button>
		</li>
	);
}
