const alumnos = [
	{ nombre: "Ana", nota: 8 },
	{ nombre: "Luis", nota: 4 },
	{ nombre: "Sara", nota: 6.5 },
	{ nombre: "Pablo", nota: 3 },
	{ nombre: "Marta", nota: 5 },
];

const grupos = Object.groupBy(alumnos, alumno => alumno.nota >= 5 ? "aprobados" : "suspensos");

console.log(grupos);

