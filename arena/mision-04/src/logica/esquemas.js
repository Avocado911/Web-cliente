import { z } from "zod";
import { CARNES, SECCIONES, EDAD_MINIMA, MAYORIA_EDAD, MAXIMO_MOTIVO } from "./catalogo.js";

const valores = (lista) => lista.map((opcion) => opcion.valor);

// Campos que comparten el formulario y lo que devuelve el API: se definen una sola vez
const camposSocio = z.object({
	nombre: z
		.string({ error: "Falta el nombre" })
		.trim()
		.min(2, "El nombre debe tener al menos 2 letras")
		.max(40, "El nombre no puede pasar de 40 letras")
		.regex(/^[\p{L} .'-]+$/u, "El nombre solo puede llevar letras y espacios"),
	// trim y minusculas antes de comprobar el formato: " Ana@Correo.es " es valido y se guarda limpio
	correo: z.string({ error: "Falta el correo" }).trim().toLowerCase().pipe(z.email("Escribe un correo válido, como nombre@dominio.es")),
	// coerce: el input entrega texto ("25") y el esquema lo convierte en numero
	edad: z.coerce
		.number({ error: "La edad debe ser un número" })
		.int("La edad debe ser un número entero")
		.min(EDAD_MINIMA, `La edad mínima para el carné es ${EDAD_MINIMA} años`)
		.max(120, "Revisa la edad: no puede pasar de 120"),
	carne: z.enum(valores(CARNES), { error: "Elige un tipo de carné" }),
	seccion: z.enum(valores(SECCIONES), { error: "Elige tu sección favorita" }),
	tutor: z.string().trim().max(40, "El nombre del tutor no puede pasar de 40 letras").optional(),
	motivo: z.string().trim().max(MAXIMO_MOTIVO, `El motivo no puede pasar de ${MAXIMO_MOTIVO} caracteres`).optional(),
});

// Esquema del formulario: los campos + la casilla de normas + las reglas que cruzan varios campos
export const esquemaFormulario = camposSocio
	.extend({
		normas: z.literal(true, { error: "Tienes que aceptar las normas de la biblioteca" }),
	})
	.superRefine((datos, contexto) => {
		const esMenor = datos.edad < MAYORIA_EDAD;
		if (esMenor && (datos.tutor ?? "").length < 2) {
			contexto.addIssue({
				code: "custom",
				path: ["tutor"],
				message: "Si eres menor de edad, indica el nombre de tu tutor",
			});
		}
		if (esMenor && datos.carne === "investigador") {
			contexto.addIssue({
				code: "custom",
				path: ["carne"],
				message: "El carné de investigador es solo para mayores de edad",
			});
		}
	})
	// Lo que sale hacia el API: sin la casilla (no es un dato del socio) y sin campos vacios
	.transform(({ normas, tutor, motivo, ...socio }) => ({
		...socio,
		...(socio.edad < MAYORIA_EDAD && tutor ? { tutor } : {}),
		...(motivo ? { motivo } : {}),
	}));

// Esquema de un socio tal y como lo devuelve el API: los mismos campos + lo que pone el servidor
export const esquemaSocio = camposSocio.extend({
	id: z.union([z.number(), z.string()]),
	alta: z.iso.datetime({ error: "La fecha de alta no es válida" }),
});
