// clave con la que se guarda la preferencia en localStorage
const THEME_KEY = "theme";

const button = document.querySelector("#theme-button");
const storedValue = document.querySelector("#stored-value");

// pinta el tema que le pasen: pone o quita la clase del body y actualiza el texto
function applyTheme(theme) {
	// toggle con segundo argumento: true la pone, false la quita (no alterna a ciegas)
	document.body.classList.toggle("dark", theme === "dark");
	button.textContent = theme === "dark" ? "Cambiar a claro" : "Cambiar a oscuro";
	storedValue.textContent = localStorage.getItem(THEME_KEY) ?? "(nada todavia)";
}

// al cargar: getItem da null si nunca se guardo nada, y entonces se usa "light"
// ojo: localStorage solo guarda texto, asi que se compara con el string "dark", no con un booleano
const savedTheme = localStorage.getItem(THEME_KEY) ?? "light";
applyTheme(savedTheme);

button.addEventListener("click", () => {
	const current = document.body.classList.contains("dark") ? "dark" : "light";
	const next = current === "dark" ? "light" : "dark";

	// primero se guarda y luego se pinta, para que el texto de "valor guardado" ya salga actualizado
	localStorage.setItem(THEME_KEY, next);
	applyTheme(next);
});

// para verlo en DevTools: F12 -> Application -> Local Storage -> el origen de la pagina -> clave "theme"
