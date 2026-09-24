# 1.3 El precio justo

Nivel 1 · Calentamiento · 10 min · sin IA

## Enunciado

Escribe `precioFinal(precio, descuento)`:

- Descuento `null`/`undefined` -> 0 % (con `??`, no con `||`).
- Un descuento de 0 es valido.
- Precio negativo -> `"Precio no valido"`.

```js
precioFinal(100, 25); // 75
precioFinal(100, 0);  // 100
precioFinal(100);     // 100
precioFinal(-5, 10);  // "Precio no valido"
```
