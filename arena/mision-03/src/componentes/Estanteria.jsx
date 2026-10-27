export default function Estanteria({ favoritos, onAlternarFavorito, onAbrir }) {
	const ordenados = favoritos.toSorted((a, b) => a.titulo.localeCompare(b.titulo, "es"));

	return (
		<section className="tarjeta-panel">
			<h2>Mi estanteria ({favoritos.length})</h2>
			<ul className="lista-favoritos">
				{ordenados.length === 0 && <li className="vacio">Aun no has guardado ningun libro.</li>}
				{ordenados.map((libro) => (
					<li key={libro.id}>
						<button type="button" className="abrir-detalle" onClick={() => onAbrir(libro)}>{libro.titulo}</button>
						<button
							type="button"
							className="quitar-favorito"
							aria-label={`Quitar ${libro.titulo} de la estanteria`}
							onClick={() => onAlternarFavorito(libro)}
						>
							✕
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}
