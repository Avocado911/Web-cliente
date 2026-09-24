const email = document.querySelector("#email");
const msg = document.querySelector("#mensaje");

email.addEventListener("input", () => {
	const texto = email.value;
	if (texto.includes("@") && texto.includes(".")) {
		msg.textContent = "Este correo si que es valido";
	} else {
		msg.textContent = "Esto no es un correo valido";
	}
});
