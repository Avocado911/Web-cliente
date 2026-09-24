const pantalla = document.querySelector("#numero");
const subida = document.querySelector("#subida");
const bajada = document.querySelector("#bajada");
let valor = 0;

subida.addEventListener("click", () => {
	valor++;
	pantalla.textContent = valor;
});

bajada.addEventListener("click", () => {
	valor--;
	pantalla.textContent = valor;
});
