import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaFormulario } from "../logica/esquemas.js";
import { CARNES, SECCIONES, MAYORIA_EDAD } from "../logica/catalogo.js";
import Campo from "./Campo.jsx";

const VALORES_INICIALES = {
	nombre: "",
	correo: "",
	edad: "",
	carne: "",
	seccion: "",
	tutor: "",
	motivo: "",
	normas: false,
};

export default function FormularioSocio({ onAlta }) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		// Toda la validacion vive en el esquema Zod: aqui no hay ni un "required"
		resolver: zodResolver(esquemaFormulario),
		// Valida un campo al salir de el por primera vez y, desde ahi, en cada cambio
		mode: "onTouched",
		defaultValues: VALORES_INICIALES,
	});

	// Solo se observa la edad: es el unico valor que cambia lo que se pinta (el campo del tutor)
	const edad = useWatch({ control, name: "edad" });
	const esMenor = edad !== "" && Number(edad) < MAYORIA_EDAD;

	// handleSubmit solo llama a esta funcion si el esquema da los datos por buenos (ya limpios)
	function alEnviar(datos) {
		onAlta?.(datos);
	}

	return (
		<form className="formulario" onSubmit={handleSubmit(alEnviar)} noValidate>
			<h2>Solicitud de carné</h2>

			<Campo etiqueta="Nombre y apellidos" nombre="nombre" autoComplete="name"
				error={errors.nombre} registro={register("nombre")} />

			<Campo etiqueta="Correo" nombre="correo" tipo="email" autoComplete="email"
				ayuda="Solo se usa para avisarte de los préstamos."
				error={errors.correo} registro={register("correo")} />

			<Campo etiqueta="Edad" nombre="edad" inputMode="numeric"
				error={errors.edad} registro={register("edad")} />

			{esMenor && (
				<Campo etiqueta="Nombre de tu tutor" nombre="tutor"
					ayuda="Los menores de edad necesitan un adulto responsable."
					error={errors.tutor} registro={register("tutor")} />
			)}

			<Campo etiqueta="Tipo de carné" nombre="carne" opciones={CARNES}
				error={errors.carne} registro={register("carne")} />

			<Campo etiqueta="Sección favorita" nombre="seccion" opciones={SECCIONES}
				error={errors.seccion} registro={register("seccion")} />

			<Campo etiqueta="¿Qué vienes buscando? (opcional)" nombre="motivo" tipo="textarea"
				ayuda="Máximo 200 caracteres."
				error={errors.motivo} registro={register("motivo")} />

			<Campo etiqueta="Acepto las normas de la biblioteca" nombre="normas" tipo="checkbox"
				error={errors.normas} registro={register("normas")} />

			<button type="submit" className="boton">Solicitar carné</button>
		</form>
	);
}
