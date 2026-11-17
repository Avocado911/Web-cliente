// Clase base: solo sirve de molde, cada figura concreta tiene que dar su propia area
class Figura {
	constructor(nombre) {
		this.nombre = nombre;
	}

	// si una subclase no sobreescribe area, al llamarla se llega hasta aqui y salta el error
	area() {
		throw new Error("no implementado");
	}
}

class Circulo extends Figura {
	constructor(radio) {
		// super va antes de usar this: es el constructor del padre el que crea el objeto
		super("circulo");
		this.radio = radio;
	}

	// sobreescribe el area del padre: JS encuentra este antes al subir por la cadena de prototipos
	area() {
		return Math.PI * this.radio ** 2;
	}
}

class Rectangulo extends Figura {
	constructor(ancho, alto) {
		super("rectangulo");
		this.ancho = ancho;
		this.alto = alto;
	}

	area() {
		return this.ancho * this.alto;
	}
}

const figuras = [new Circulo(1), new Rectangulo(2, 3), new Circulo(2), new Rectangulo(4, 5)];

// cada figura responde a area() con su propia formula, aunque todas se llamen igual
for (const figura of figuras) {
	console.log(`${figura.nombre} ->`, figura.area().toFixed(2));
}

// reduce: total es el acumulador (empieza en 0) y en cada vuelta se le suma el area de la figura
const areaTotal = figuras.reduce((total, figura) => total + figura.area(), 0);
console.log("area total ->", areaTotal.toFixed(2));

// un Circulo tambien es una Figura: Figura.prototype esta en su cadena
console.log("circulo instanceof Figura ->", figuras[0] instanceof Figura);

// una Figura a secas no tiene area propia, asi que se ejecuta la de la clase base y lanza el error
try {
	new Figura("generica").area();
} catch (error) {
	console.log("figura generica ->", error.message);
}
