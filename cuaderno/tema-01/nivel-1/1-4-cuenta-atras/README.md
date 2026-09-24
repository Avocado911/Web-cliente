# 1.4 Cuenta atras de lanzamiento

Nivel 1 · Calentamiento · 15 min · sin IA

## Enunciado

Cuenta atras del 10 al 0 con un bucle descendente. Reglas de la sala de control:

- Numero par: `n... (comprobando sistemas)`.
- Numero impar: solo `n...`.
- En 3, 2 y 1 se anade `¡Abrochense!`.
- En 0: `🚀 ¡Despegue!` y el bucle termina.

Salida esperada:

```
10... (comprobando sistemas)
9...
...
3... ¡Abrochense!
2... (comprobando sistemas) ¡Abrochense!
1... ¡Abrochense!
🚀 ¡Despegue!
```

Pista: construye la linea en una variable `` let linea = `${n}...`; `` y ve concatenando condiciones. Par: `n % 2 === 0`.
