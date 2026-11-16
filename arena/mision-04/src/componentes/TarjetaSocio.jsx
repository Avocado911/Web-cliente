import { useState } from "react";
import { CARNES, SECCIONES, textoDe } from "../logica/catalogo.js";

const formatoFecha = new Intl.DateTimeFormat("es-ES", { dateStyle: "long" });

export default function TarjetaSocio({ socio, onBaja, dandoDeBaja }) {
	// Borrar no se puede deshacer: el primer clic solo pide confirmacion.
	// Es estado local porque no le importa a nadie mas que a esta tarjeta.
	const [confirmando, setConfirmando] = useState(false);

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

			{confirmando ? (
				<div className="confirmacion" role="group" aria-label={`Confirmar la baja de ${socio.nombre}`}>
					<span>¿Seguro?</span>
					<button type="button" className="boton boton-pequeno boton-peligro" disabled={dandoDeBaja}
						onClick={() => onBaja(socio.id)}>
						{dandoDeBaja ? "Dando de baja…" : "Sí, dar de baja"}
					</button>
					<button type="button" className="boton boton-pequeno boton-baja" disabled={dandoDeBaja}
						onClick={() => setConfirmando(false)}>
						Cancelar
					</button>
				</div>
			) : (
				<button type="button" className="boton boton-pequeno boton-baja"
					onClick={() => setConfirmando(true)} aria-label={`Dar de baja a ${socio.nombre}`}>
					Dar de baja
				</button>
			)}
		</li>
	);
}
