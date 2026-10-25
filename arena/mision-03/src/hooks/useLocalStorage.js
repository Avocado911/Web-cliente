import { useEffect, useState } from "react";
import { leer, guardar } from "../logica/almacen.js";

// Como useState, pero el valor sobrevive a recargas. esValido descarta datos corruptos
// o de otra version de la app (por ejemplo, un objeto donde se esperaba un array)
export function useLocalStorage(clave, valorInicial, esValido = () => true) {
	// Inicializador perezoso: localStorage se lee solo en el primer render, no en todos
	const [valor, setValor] = useState(() => {
		const guardado = leer(clave, valorInicial);
		return esValido(guardado) ? guardado : valorInicial;
	});

	// Cada vez que cambia el valor se copia a localStorage
	useEffect(() => {
		guardar(clave, valor);
	}, [clave, valor]);

	return [valor, setValor];
}
