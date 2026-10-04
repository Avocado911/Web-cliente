# 1.1 El detector de sorpresas

Nivel 1 · Calentamiento · 15 min · sin IA

## Enunciado

Antes de ejecutar nada, escribe en comentarios tu prediccion para cada expresion. Despues compruebalas en la consola y anota en cuales fallaste y por que.

```js
"10" + 5;
"10" - 5;
10 == "10";
10 === "10";
true + true;
"" == false;
"" === false;
null ?? "vacio";
0 || "cero";
0 ?? "cero";
```

Formato libre, por ejemplo:

```
"10" + 5 -> predije "105" -> correcto: + con string concatena.
```

## Uso de IA

Aunque el enunciado lo planteaba sin IA, este ejercicio lo resolvio Claude (Anthropic) a peticion mia, para tenerlo de referencia. Lo he revisado despues.

Al estar resuelto con IA, en `app.js` no hay predicciones propias: cada expresion lleva su resultado real y por que sale asi.
