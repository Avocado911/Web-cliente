# Reto jefe · Memoria Cosmica 🧠

IA libre (declarada) · 3-4 h · nivel 3

Juego de parejas: 16 cartas boca abajo (8 parejas de emojis); destapas dos por turno y, si coinciden, quedan resueltas. Gana quien acabe en menos movimientos.

## Fases

1. Tablero estatico: `Juego` → `Tablero` → `Carta`, rejilla 4×4, `key` estable.
2. Reducer y destape: accion `destapar`; «boca arriba» es un dato derivado.
3. Resolver el turno: un `useEffect` observa `destapadas`; a las 2, espera 800 ms y despacha. La limpieza cancela el timeout.
4. Cronometro y victoria: `setInterval` → `tic` (¡con limpieza!). Victoria derivada con `every`.
5. Pulido: marcador visible, resueltas atenuadas, sin trampas.

## Codigo de partida (`src/reto/logica.js`, «en el cuaderno»)

- `crearMazo()`: 16 cartas `{ id, emoji, resuelta }` barajadas.
- `estadoInicial`: `{ cartas, destapadas: [], movimientos: 0, segundos: 0 }`.
- Esqueleto del reducer (`destapar`, `resolverTurno`, `tic`, `reiniciar`) con dos TODO.

(?) Este codigo de partida no esta en el material bajado (ni en la presentacion ni en `temario/`): si no aparece en Blackboard o la Arena, se escribe desde cero con esa misma forma.

## Retos

- [ ] Niveles de dificultad (4×3, 4×4, 6×4) antes de empezar.
- [ ] Record personal en `localStorage`.
- [ ] React 19 (opcional): guardar la puntuacion con `useActionState` y «Guardando…» mientras esta pendiente (adelanto de la U4).

## Rubrica de autoevaluacion

| Criterio | Aprobado | Notable | Sobresaliente |
|---|---|---|---|
| Estado | El juego funciona con `useReducer` | Todas las transiciones pasan por el reducer, sin `useState` paralelos | El reducer es una funcion pura testeable: mismas entradas, mismo estado |
| Inmutabilidad | No hay mutaciones directas | Uso sistematico de spread, `map` y `every` | Ninguna estructura del estado se comparte mutada entre renders |
| Efectos | El tablero se resuelve solo tras 800 ms | Timeout e intervalo con limpieza correcta | Sin dobles disparos con StrictMode y sin warnings de dependencias |
| Derivacion | La victoria se detecta | Victoria y «tablero bloqueado» son derivados, no estado | Cero estados redundantes en todo el juego |
| Componentes | Todo en un fichero, pero funciona | `Juego`, `Tablero`, `Carta` y `Marcador` separados con props claras | `Carta` es 100 % presentacional: solo props y eventos |

Las filas Estado, Efectos y Derivacion son las que se examinan en la defensa oral de la Arena. Candidato natural para la M3 (con CSS propio y README).
