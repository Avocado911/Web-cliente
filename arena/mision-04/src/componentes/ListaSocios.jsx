import { useState } from "react";
import { useSocios } from "../hooks/useSocios.js";
import { useBajaSocio } from "../hooks/useBajaSocio.js";
import { CARNES } from "../logica/catalogo.js";
import Aviso from "./Aviso.jsx";
import TarjetaSocio from "./TarjetaSocio.jsx";
import RegistrosCorruptos from "./RegistrosCorruptos.jsx";

export default function ListaSocios() {
	// "" = todos los carnes. El filtro lo aplica el servidor, no un .filter() sobre lo descargado
	const [carne, setCarne] = useState("");
	const { data, isPending, isError, error, isFetching, refetch } = useSocios(carne);
	// data no existe hasta que llega la primera respuesta
	const socios = data?.socios;
	const corruptos = data?.corruptos ?? [];
	const baja = useBajaSocio();
	// "variables" es el argumento con el que se llamo a mutate: aqui, el id que se esta borrando
	const idEnBaja = baja.isPending ? baja.variables : null;

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
		contenido = (
			<Aviso tipo="vacio">
				{carne ? "No hay ningún socio con ese tipo de carné." : "Todavía no hay ningún socio. ¡Sé el primero!"}
			</Aviso>
		);
	} else {
		contenido = (
			<ul className="lista-socios">
				{socios.map((socio) => (
					<TarjetaSocio key={socio.id} socio={socio}
						onBaja={baja.mutate} dandoDeBaja={idEnBaja === socio.id} />
				))}
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

			<div className="filtro">
				<label htmlFor="filtro-carne">Filtrar por carné</label>
				<select id="filtro-carne" value={carne} onChange={(evento) => setCarne(evento.target.value)}>
					<option value="">Todos</option>
					{CARNES.map((opcion) => (
						<option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
					))}
				</select>
			</div>

			{baja.isError && <Aviso tipo="error">No se pudo dar de baja al socio. {baja.error.message}</Aviso>}
			{contenido}
			<RegistrosCorruptos corruptos={corruptos} onPurgar={baja.mutate} idEnBaja={idEnBaja} />
		</section>
	);
}
