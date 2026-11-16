import { useWatch } from "react-hook-form";

// Cuenta en vivo los caracteres de un campo ("37/200").
// useWatch esta aqui dentro a proposito: al teclear solo se vuelve a pintar este contador,
// no el formulario entero, que sigue siendo no controlado.
export default function ContadorCaracteres({ control, nombre, maximo }) {
	const texto = useWatch({ control, name: nombre }) ?? "";
	const pasado = texto.length > maximo;
	return (
		<span className="contador-caracteres" data-pasado={pasado}>
			{texto.length}/{maximo} caracteres
		</span>
	);
}
