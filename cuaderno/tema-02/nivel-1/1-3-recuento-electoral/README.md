# 1.3 Recuento electoral con Map y Set

Nivel 1 · Calentamiento · 15 min · sin IA

## Enunciado

```js
const votos = ["Ana", "Luis", "Ana", "Sara", "Luis", "Ana", "Sara", "Ana"];
```

`escrutinio(votos)` devuelve `{ candidatos, recuento, ganadora }`:

- `candidatos`: nombres unicos (con `Set`).
- `recuento`: `Map` nombre -> numero de votos.
- `ganadora`: quien tiene mas votos.

```
candidatos -> ["Ana", "Luis", "Sara"]
recuento   -> Map(3) { "Ana" => 4, "Luis" => 2, "Sara" => 2 }
ganadora   -> "Ana"
```

Pista: acumula con `recuento.set(nombre, (recuento.get(nombre) ?? 0) + 1)`. Para la ganadora, itera las entries guardando el maximo, o `[...recuento].toSorted(...)`.
