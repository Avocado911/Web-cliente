// Listas cerradas del dominio: las usan el esquema (valores validos) y el formulario (opciones del select)
export const CARNES = [
	{ valor: "lector", texto: "Lector (sala general)" },
	{ valor: "investigador", texto: "Investigador (fondo antiguo)" },
	{ valor: "archivista", texto: "Archivista (voluntario)" },
];

export const SECCIONES = [
	{ valor: "grimorios", texto: "Grimorios" },
	{ valor: "bestiarios", texto: "Bestiarios" },
	{ valor: "alquimia", texto: "Alquimia" },
	{ valor: "cartografia", texto: "Cartografía" },
	{ valor: "cronicas", texto: "Crónicas" },
];

export const EDAD_MINIMA = 12;
export const MAYORIA_EDAD = 18;

// Devuelve el texto visible de un valor ("alquimia" -> "Alquimia"); si no esta, el propio valor
export function textoDe(lista, valor) {
	return lista.find((opcion) => opcion.valor === valor)?.texto ?? valor;
}
