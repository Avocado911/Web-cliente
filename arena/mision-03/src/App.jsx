import { useCallback, useState } from "react";
import Buscador from "./componentes/Buscador.jsx";
import Controles from "./componentes/Controles.jsx";
import Mensaje from "./componentes/Mensaje.jsx";
import ListaLibros from "./componentes/ListaLibros.jsx";
import Estadisticas from "./componentes/Estadisticas.jsx";
import Estanteria from "./componentes/Estanteria.jsx";
import DetalleLibro from "./componentes/DetalleLibro.jsx";
import { useBusquedaLibros } from "./hooks/useBusquedaLibros.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { filtrarLibros, ordenarLibros, alternarFavorito } from "./logica/datos.js";

const FILTROS_INICIALES = { soloEspanol: false, soloConPortada: false };
const CLAVE_FAVORITOS = "biblioteca-arcana-favoritos";

export default function App() {
	// Estado minimo: lo que el usuario ha elegido. Todo lo demas se calcula
	const [busqueda, setBusqueda] = useState("");
	const [orden, setOrden] = useState("relevancia");
	const [filtros, setFiltros] = useState(FILTROS_INICIALES);
	const [favoritos, setFavoritos] = useLocalStorage(CLAVE_FAVORITOS, [], Array.isArray);
	// Del libro abierto basta con su id: el objeto se busca en lo que ya hay
	const [idAbierto, setIdAbierto] = useState(null);

	const { estado, libros, error, reintentar } = useBusquedaLibros(busqueda);

	// Estado derivado: se recalcula en cada render, nunca se guarda aparte
	const visibles = ordenarLibros(filtrarLibros(libros, filtros), orden);
	const idsFavoritos = new Set(favoritos.map((libro) => libro.id));
	const libroAbierto = [...libros, ...favoritos].find((libro) => libro.id === idAbierto) ?? null;

	function cambiarFavorito(libro) {
		// Forma funcional: parte siempre del valor mas reciente, no del de este render
		setFavoritos((anteriores) => alternarFavorito(anteriores, libro));
	}

	// useCallback mantiene la misma funcion entre renders: el efecto de DetalleLibro
	// que depende de ella no quita y vuelve a poner su listener en cada render
	const cerrarDetalle = useCallback(() => setIdAbierto(null), []);

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
				<ListaLibros
					libros={visibles}
					idsFavoritos={idsFavoritos}
					onAlternarFavorito={cambiarFavorito}
					onAbrir={setIdAbierto}
				/>
				<aside className="panel">
					<Estadisticas libros={visibles} />
					<Estanteria favoritos={favoritos} onAlternarFavorito={cambiarFavorito} onAbrir={setIdAbierto} />
				</aside>
			</div>

			{libroAbierto && (
				<DetalleLibro
					libro={libroAbierto}
					marcado={idsFavoritos.has(libroAbierto.id)}
					onAlternarFavorito={cambiarFavorito}
					onCerrar={cerrarDetalle}
				/>
			)}
		</main>
	);
}
