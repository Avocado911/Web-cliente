import FormularioSocio from "./componentes/FormularioSocio.jsx";
import ListaSocios from "./componentes/ListaSocios.jsx";

export default function App() {
	return (
		<div className="biblioteca">
			<header className="cabecera">
				<h1>Biblioteca Arcana</h1>
				<p className="subtitulo">Registro de socios</p>
			</header>
			<main className="paneles">
				<FormularioSocio />
				<ListaSocios />
			</main>
		</div>
	);
}
