export default function Portada({ libro, grande = false }) {
	const clase = grande ? "portada portada-grande" : "portada";
	if (!libro.portada) {
		return <div className={`${clase} sin-portada`}>📖</div>;
	}
	return <img className={clase} src={libro.portada} alt={`Portada de ${libro.titulo}`} loading="lazy" />;
}
