import { calcularEstadisticas } from "../logica/datos.js";

// Las estadisticas no se guardan en ningun estado: se calculan de los libros visibles
export default function Estadisticas({ libros }) {
	const { total, decadas, mediaPaginas, masAntiguo } = calcularEstadisticas(libros);
	if (total === 0) {
		return null;
	}
	const maximo = Math.max(...decadas.map((decada) => decada.total));

	return (
		<section className="tarjeta-panel">
			<h2>Libros por decada</h2>
			<ul className="lista-estadisticas">
				{decadas.map(({ decada, total: cantidad }) => (
					<li key={decada}>
						<span>{decada}</span>
						<span className="hueco-barra">
							<span className="barra" style={{ width: `${(cantidad / maximo) * 100}%` }} />
						</span>
						<span>{cantidad}</span>
					</li>
				))}
			</ul>
			<p className="detalles">Media de paginas: {mediaPaginas ?? "sin datos"}</p>
			{masAntiguo && <p className="detalles">Mas antiguo: {masAntiguo.titulo} ({masAntiguo.anio})</p>}
		</section>
	);
}
