import { useState } from "react";
import Buscador from "./componentes/Buscador.jsx";
import Controles from "./componentes/Controles.jsx";
import Mensaje from "./componentes/Mensaje.jsx";
import ListaLibros from "./componentes/ListaLibros.jsx";
import Estadisticas from "./componentes/Estadisticas.jsx";
import Estanteria from "./componentes/Estanteria.jsx";
import { useBusquedaLibros } from "./hooks/useBusquedaLibros.js";
import { filtrarLibros, ordenarLibros, alternarFavorito } from "./logica/datos.js";

const FILTROS_INICIALES = { soloEspanol: false, soloConPortada: false };

export default function App() {
	// Estado minimo: lo que el usuario ha elegido. Todo lo demas se calcula
	const [busqueda, setBusqueda] = useState("");
	const [orden, setOrden] = useState("relevancia");
	const [filtros, setFiltros] = useState(FILTROS_INICIALES);
	const [favoritos, setFavoritos] = useState([]);

	const { estado, libros, error, reintentar } = useBusquedaLibros(busqueda);

	// Estado derivado: se recalcula en cada render, nunca se guarda aparte
	const visibles = ordenarLibros(filtrarLibros(libros, filtros), orden);
	const idsFavoritos = new Set(favoritos.map((libro) => libro.id));

	function cambiarFavorito(libro) {
		// Forma funcional: parte siempre del valor mas reciente, no del de este render
		setFavoritos((anteriores) => alternarFavorito(anteriores, libro));
	}

	return (
		<main className="biblioteca">
			<header className="cabecera">
				<h1>📚 Biblioteca Arcana</h1>
				<p className="subtitulo">Consulta los archivos de OpenLibrary y guarda tus hallazgos en tu estanteria.</p>
			</header>

			<Buscador onBuscar={setBusqueda} />
			<Controles orden={orden} filtros={filtros} onCambiarOrden={setOrden} onCambiarFiltros={setFiltros} />
			<Mensaje
				estado={estado}
				busqueda={busqueda}
				error={error}
				totalLibros={libros.length}
				totalVisibles={visibles.length}
				onReintentar={reintentar}
			/>

			<div className="contenido">
				<ListaLibros libros={visibles} idsFavoritos={idsFavoritos} onAlternarFavorito={cambiarFavorito} />
				<aside className="panel">
					<Estadisticas libros={visibles} />
					<Estanteria favoritos={favoritos} onAlternarFavorito={cambiarFavorito} />
				</aside>
			</div>
		</main>
	);
}
