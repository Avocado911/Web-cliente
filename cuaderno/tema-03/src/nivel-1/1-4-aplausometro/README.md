# 1.4 El aplausometro

15 min · sin IA · nivel 1

Componente `Aplausometro` con:

- Boton «👏 Aplaudir» que incrementa un contador.
- Boton «Reiniciar» que lo devuelve a 0.
- Un mensaje segun el nivel: menos de 5 → «Timido...», de 5 a 14 → «¡Se anima la sala!», 15 o mas → «¡OVACION TOTAL! 🎉».

Resultado esperado: el contador sube de uno en uno, el mensaje cambia solo al cruzar los umbrales y «Reiniciar» vuelve al estado inicial.

El mensaje no es estado: derivalo del contador durante el render (un `if` antes del `return` o un ternario encadenado).

Pregunta trampa: ¿cuantos `useState` necesitas? Si has escrito dos, uno sobra.
