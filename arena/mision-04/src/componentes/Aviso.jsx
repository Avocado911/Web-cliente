// Mensaje de estado (cargando, error, exito, vacio). El tipo decide el estilo en el CSS.
// Los errores usan role="alert" (se leen al momento); el resto, role="status" (sin interrumpir).
export default function Aviso({ tipo, children }) {
	return (
		<p className="aviso" data-tipo={tipo} role={tipo === "error" ? "alert" : "status"}>
			{children}
		</p>
	);
}
