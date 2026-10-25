import TarjetaLibro from "./TarjetaLibro.jsx";

export default function ListaLibros({ libros, idsFavoritos, onAlternarFavorito }) {
	return (
		<section className="resultados" aria-label="Resultados de la busqueda">
			{libros.map((libro) => (
				// La key es el id de OpenLibrary: estable aunque cambie el orden o el filtro
				<TarjetaLibro
					key={libro.id}
					libro={libro}
					marcado={idsFavoritos.has(libro.id)}
					onAlternarFavorito={onAlternarFavorito}
				/>
			))}
		</section>
	);
}
