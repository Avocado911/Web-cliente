const saludar = (nombre = "invitado") => `Hola, ${nombre}`;

console.log(saludar("Alfredo")); // Hola, Alfredo
console.log(saludar());          // Hola, invitado
