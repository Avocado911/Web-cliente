// Fase 5: un generico propio. T es un hueco que se rellena con el tipo de la lista que le pases:
// con Cancion[] devuelve Cancion | undefined, con string[] devuelve string | undefined.
// En C seria un void* y habria que hacer cast; aqui TS no pierde el tipo y no hace falta any
export function ultima<T>(lista: readonly T[]): T | undefined {
	// at(-1) es el ultimo; si la lista esta vacia da undefined, por eso el retorno incluye undefined
	return lista.at(-1);
}
