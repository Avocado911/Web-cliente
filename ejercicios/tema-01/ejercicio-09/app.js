const titulo = document.querySelector("#titulo");
const botonCambiar = document.querySelector("#cambiar");

botonCambiar.addEventListener("click", () => {
	titulo.textContent = "Titulo cambiado";
	titulo.classList.add("destacado");
});
