// Registros que el API ha devuelto pero no cumplen el esquema Zod (bonus de la mision).
// No se pintan como socios: se listan aparte con el motivo y se pueden purgar del archivo.
export default function RegistrosCorruptos({ corruptos, onPurgar, idEnBaja }) {
	if (corruptos.length === 0) return null;

	return (
		<details className="corruptos" open>
			<summary>
				{corruptos.length === 1
					? "1 registro dañado apartado del listado"
					: `${corruptos.length} registros dañados apartados del listado`}
			</summary>
			<p>El archivo los devolvió, pero no pasan la validación y no se muestran como socios.</p>
			<ul>
				{corruptos.map((registro, posicion) => (
					<li key={registro.id ?? `sin-id-${posicion}`}>
						<strong>Registro {registro.id ?? "sin id"}</strong>
						<ul>
							{registro.problemas.map((problema) => <li key={problema}>{problema}</li>)}
						</ul>
						{registro.id !== null && (
							<button type="button" className="boton boton-pequeno boton-baja"
								disabled={idEnBaja === registro.id} onClick={() => onPurgar(registro.id)}>
								{idEnBaja === registro.id ? "Purgando…" : "Purgar del archivo"}
							</button>
						)}
					</li>
				))}
			</ul>
		</details>
	);
}
