// Un campo del formulario: etiqueta + control + ayuda + error, enlazados para lectores de pantalla.
// "registro" es lo que devuelve register("nombre") de React Hook Form (name, ref, onChange, onBlur).
export default function Campo({ etiqueta, nombre, error, ayuda, tipo = "text", opciones, registro, ...resto }) {
	const idAyuda = `${nombre}-ayuda`;
	const idError = `${nombre}-error`;
	// aria-describedby apunta a la ayuda y, si hay, al error: el lector los lee al entrar en el campo
	const descritoPor = [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") || undefined;

	const comunes = {
		id: nombre,
		"aria-invalid": error ? "true" : "false",
		"aria-describedby": descritoPor,
		...registro,
		...resto,
	};

	let control;
	if (opciones) {
		control = (
			<select {...comunes}>
				<option value="">Elige una opción…</option>
				{opciones.map((opcion) => (
					<option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
				))}
			</select>
		);
	} else if (tipo === "textarea") {
		control = <textarea rows={3} {...comunes} />;
	} else {
		control = <input type={tipo} {...comunes} />;
	}

	const esCasilla = tipo === "checkbox";

	return (
		<div className={esCasilla ? "campo campo-casilla" : "campo"}>
			{esCasilla ? (
				<label htmlFor={nombre}>{control} {etiqueta}</label>
			) : (
				<>
					<label htmlFor={nombre}>{etiqueta}</label>
					{control}
				</>
			)}
			{ayuda && <p id={idAyuda} className="ayuda">{ayuda}</p>}
			{error && <p id={idError} className="error-campo" role="alert">{error.message}</p>}
		</div>
	);
}
