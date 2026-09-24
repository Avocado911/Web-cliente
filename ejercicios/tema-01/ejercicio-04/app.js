const temp = Number(prompt("mete la temperatura en celsius:"));

function celsiusAFahrenheit(c) {
	return ((c * (9 / 5)) + 32);
}

console.log(celsiusAFahrenheit(temp));

console.log(celsiusAFahrenheit(0));   // 32
console.log(celsiusAFahrenheit(100)); // 212
console.log(celsiusAFahrenheit(37));  // 98.60000000000001 (IEEE 754, como 0.1 + 0.2)
console.log(celsiusAFahrenheit(-40)); // -40
