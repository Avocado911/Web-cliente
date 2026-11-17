# 1.1 La tripulacion

10-15 min · sin IA · nivel 1

Estas fichando a la tripulacion de una nave.

- Componente `FichaTripulante` con props `nombre`, `rol` y `especie` (por defecto `"humana"`).
- Devuelve un `<article>` con un titulo y dos lineas de texto.
- Desde `App`, renderiza al menos cuatro tripulantes, alguno sin pasar `especie`.

Resultado esperado: cuatro fichas en pantalla; la que no recibe especie muestra «humana».

```jsx
function FichaTripulante({ nombre, rol, especie = "humana" }) {
  // …
}
```

Pista: desestructura en los parametros y usa el valor por defecto de JavaScript.
