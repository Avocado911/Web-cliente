// Orden y filtros: no guarda nada, avisa al padre de cada cambio
export default function Controles({ orden, filtros, onCambiarOrden, onCambiarFiltros }) {
	function cambiarFiltro(nombre, valor) {
		// Objeto nuevo en vez de modificar el que llega por props
		onCambiarFiltros({ ...filtros, [nombre]: valor });
	}

	return (
		<section className="controles" aria-label="Orden y filtros">
			<label>
				Ordenar por
				<select value={orden} onChange={(event) => onCambiarOrden(event.target.value)}>
					<option value="relevancia">Relevancia</option>
					<option value="anio-desc">Mas recientes</option>
					<option value="anio-asc">Mas antiguos</option>
					<option value="titulo">Titulo (A-Z)</option>
				</select>
			</label>
			<label>
				<input
					type="checkbox"
					checked={filtros.soloEspanol}
					onChange={(event) => cambiarFiltro("soloEspanol", event.target.checked)}
				/>
				Solo en español
			</label>
			<label>
				<input
					type="checkbox"
					checked={filtros.soloConPortada}
					onChange={(event) => cambiarFiltro("soloConPortada", event.target.checked)}
				/>
				Solo con portada
			</label>
		</section>
	);
}
