# 1.2 Desempaquetando la API

Nivel 1 · Calentamiento · 10 min · sin IA

## Enunciado

```js
const respuesta = {
	data: {
		usuario: {
			nombre: "Rio", nivel: 12,
			stats: { victorias: 40, derrotas: 5 },
		},
		amigos: ["Vega", "Kai", "Nova"],
	},
};
```

Con **una sola sentencia** de desestructuracion extrae:

- `nombre`
- `victorias` renombrada a `wins`
- `rango` con valor por defecto `"novato"` (no existe)
- el primer amigo como `mejorAmigo` y el resto en `resto`

```
Rio · wins: 40 · rango: novato · mejor amigo: Vega · resto: ["Kai", "Nova"]
```

Pista: se anidan patrones: `const { data: { usuario: { nombre, stats: { victorias: wins } } } } = respuesta;` y `amigos: [mejorAmigo, ...resto]`.
