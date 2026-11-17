# 1.3 Ranking de la sala arcade

10 min · sin IA · nivel 1

Componente `Ranking` que recibe el array y pinta un `<ol>` con «JUGADOR — puntos»; medalla 🏅 si supera 8000.

```js
const RANKING = [
  { id: "a1", jugador: "NOVA", puntos: 9800 },
  { id: "b2", jugador: "PIXEL", puntos: 8650 },
  { id: "c3", jugador: "KIRA", puntos: 7400 },
  { id: "d4", jugador: "BYTE", puntos: 5200 },
];
```

Esperado: medalla en los dos primeros y cero warnings de `key` en consola.
