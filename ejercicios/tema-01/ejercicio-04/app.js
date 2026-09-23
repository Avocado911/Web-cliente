const temp = Number(prompt("mete la temperatura en celsius:"));

function celsiusAFahrenheit(temp) {
	return ((temp * (9 / 5)) + 32);
}

console.log(celsiusAFahrenheit(temp));
