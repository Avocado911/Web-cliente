# 1.1 El podio inmutable

Nivel 1 · Calentamiento · 10 min · sin IA

## Enunciado

```js
const puntuaciones = [880, 1250, 445, 990, 1250, 720];
```

Sin modificar `puntuaciones` en ningun momento:

- **(a) podio:** las tres mejores puntuaciones unicas, de mayor a menor.
- **(b) corregidas:** igual que el original pero con la mas baja sustituida por 500.

Verifica al final que `puntuaciones` sigue intacto.

```
podio      -> [1250, 990, 880]
corregidas -> [880, 1250, 500, 990, 1250, 720]
original   -> [880, 1250, 445, 990, 1250, 720]
```

Pista: duplicados fuera con `[...new Set(puntuaciones)]`. `toSorted` para ordenar sin mutar, `indexOf` del minimo y `with(indice, valor)`.
