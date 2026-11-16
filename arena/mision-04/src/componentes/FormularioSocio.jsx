import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaFormulario } from "../logica/esquemas.js";
import { CARNES, SECCIONES, EDAD_MINIMA, MAYORIA_EDAD, MAXIMO_MOTIVO } from "../logica/catalogo.js";
import { useAltaSocio } from "../hooks/useAltaSocio.js";
import Campo from "./Campo.jsx";
import Aviso from "./Aviso.jsx";
import ContadorCaracteres from "./ContadorCaracteres.jsx";

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

export default function FormularioSocio() {
	const {
		register,
		handleSubmit,
		reset,
		setError,
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

	const alta = useAltaSocio();

	// handleSubmit solo llama a esta funcion si el esquema da los datos por buenos (ya limpios)
	function alEnviar(datos) {
		alta.mutate(datos, {
			// Solo se vacia el formulario si el servidor lo ha guardado: si falla, no se pierde lo escrito
			onSuccess: () => reset(),
			onError: (error) => {
				// Un error del servidor que es de un campo se pinta en ese campo y se le da el foco
				if (error.campo) {
					setError(error.campo, { type: "servidor", message: error.message }, { shouldFocus: true });
				}
			},
		});
	}

	const errorGeneral = alta.isError && !alta.error.campo;

	return (
		<form className="formulario" onSubmit={handleSubmit(alEnviar)} noValidate>
			<h2>Solicitud de carné</h2>

			<Campo etiqueta="Nombre y apellidos" nombre="nombre" autoComplete="name"
				error={errors.nombre} registro={register("nombre")} />

			<Campo etiqueta="Correo" nombre="correo" tipo="email" autoComplete="email"
				ayuda="Solo se usa para avisarte de los préstamos."
				error={errors.correo} registro={register("correo")} />

			<Campo etiqueta="Edad" nombre="edad" inputMode="numeric"
				ayuda={`El carné se puede pedir a partir de los ${EDAD_MINIMA} años.`}
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
				ayuda={<ContadorCaracteres control={control} nombre="motivo" maximo={MAXIMO_MOTIVO} />}
				error={errors.motivo} registro={register("motivo")} />

			<Campo etiqueta="Acepto las normas de la biblioteca" nombre="normas" tipo="checkbox"
				error={errors.normas} registro={register("normas")} />

			<button type="submit" className="boton" disabled={alta.isPending}>
				{alta.isPending ? "Enviando solicitud…" : "Solicitar carné"}
			</button>

			{errorGeneral && <Aviso tipo="error">No se pudo tramitar el carné. {alta.error.message}</Aviso>}
			{alta.isSuccess && (
				<Aviso tipo="exito">Carné expedido a nombre de {alta.data.nombre}. ¡Bienvenido a la biblioteca!</Aviso>
			)}
		</form>
	);
}
