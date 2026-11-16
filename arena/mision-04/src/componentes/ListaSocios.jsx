import { useSocios } from "../hooks/useSocios.js";
import Aviso from "./Aviso.jsx";
import TarjetaSocio from "./TarjetaSocio.jsx";

export default function ListaSocios() {
	const { data: socios, isPending, isError, error, isFetching, refetch } = useSocios();

	let contenido;
	if (isPending) {
		// Primera carga: todavia no hay ningun dato que ensenar
		contenido = <Aviso tipo="cargando">Consultando el archivo de socios…</Aviso>;
	} else if (isError) {
		contenido = (
			<Aviso tipo="error">
				{error.message}{" "}
				<button type="button" className="boton boton-pequeno" onClick={() => refetch()}>Reintentar</button>
			</Aviso>
		);
	} else if (socios.length === 0) {
		contenido = <Aviso tipo="vacio">Todavía no hay ningún socio. ¡Sé el primero!</Aviso>;
	} else {
		contenido = (
			<ul className="lista-socios">
				{socios.map((socio) => <TarjetaSocio key={socio.id} socio={socio} />)}
			</ul>
		);
	}

	return (
		<section className="listado" aria-labelledby="titulo-listado">
			<h2 id="titulo-listado">
				Socios {socios && <span className="contador">({socios.length})</span>}
				{/* isFetching tambien es true en los refrescos en segundo plano, cuando ya hay datos en pantalla */}
				{isFetching && !isPending && <span className="actualizando" role="status"> actualizando…</span>}
			</h2>
			{contenido}
		</section>
	);
}
