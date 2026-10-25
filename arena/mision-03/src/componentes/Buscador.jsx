import { useState } from "react";

// Formulario controlado: el valor del input vive en el estado, no en el DOM
export default function Buscador({ onBuscar }) {
	const [texto, setTexto] = useState("");
	const [aviso, setAviso] = useState(false);

	function enviar(event) {
		event.preventDefault();
		const limpio = texto.trim();
		if (limpio === "") {
			setAviso(true);
			return;
		}
		setAviso(false);
		onBuscar(limpio);
	}

	return (
		<form className="buscador" role="search" onSubmit={enviar}>
			<label htmlFor="busqueda" className="solo-lectores">Titulo o autor</label>
			<input
				id="busqueda"
				type="search"
				placeholder="Titulo o autor..."
				autoComplete="off"
				value={texto}
				onChange={(event) => setTexto(event.target.value)}
			/>
			<button type="submit" className="boton">Buscar</button>
			{aviso && <p className="aviso">Escribe un titulo o un autor para empezar a buscar.</p>}
		</form>
	);
}
