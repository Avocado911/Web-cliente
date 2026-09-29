# 🔮 Memoria Arcana

Mision M1 de la WebI Arena: "El Despertar del DOM".

Juego de memoria de parejas con estetica mistica en tonos morados: 16 cartas boca abajo con 8 simbolos. Se giran dos cartas por turno; si coinciden se quedan descubiertas y, si no, se vuelven a tapar. La partida termina al encontrar las 8 parejas.

## Como jugar

1. Abre `index.html` en el navegador.
2. Pulsa una carta para girarla y despues otra para buscar su pareja.
3. Si coinciden, quedan descubiertas con un brillo dorado.
4. Si no coinciden, se tapan de nuevo pasado un momento.
5. "Barajar de nuevo" empieza otra partida.

**Secreto:** pulsa la tecla `-` para activar o desactivar el modo noche.

## Funcionalidades

- Tablero de 4 x 4 creado desde JavaScript y barajado en cada partida (algoritmo Fisher-Yates).
- Un unico listener en el tablero gestiona los clics de todas las cartas (delegacion de eventos con `event.target.closest`).
- Marcador de movimientos y parejas encontradas.
- Mensaje final con el numero de movimientos.
- Boton para reiniciar la partida.
- Modo noche con tecla secreta: el JS pone o quita una clase en el `body` y el CSS cambia los colores.

## Decisiones tecnicas

- **El estado vive en variables:** la partida se guarda en el objeto `estado`; el DOM solo muestra ese estado.
- **Delegacion de eventos:** las cartas se crean de nuevo en cada partida, asi que un listener en el tablero evita registrar uno por carta cada vez.
- **Cartas como `<button>`:** se pueden usar con teclado sin codigo extra.
- **`textContent` en lugar de `innerHTML`:** el texto nunca se interpreta como HTML.
- **Bloqueo del tablero** mientras se ven dos cartas que no coinciden, para que no se pueda girar una tercera.
- **Elementos seleccionados una sola vez al inicio** y guardados en constantes.
- Sin `var`, sin handlers inline y con HTML, CSS y JS en archivos separados.

## Limitacion conocida

Si se pulsa "Barajar de nuevo" justo en los 900 ms en que se ven dos cartas que no coinciden, el `setTimeout` que las tapa sigue programado y, al ejecutarse, da un error en consola porque esas cartas ya no existen. Se arreglaria guardando el identificador que devuelve `setTimeout` y cancelandolo con `clearTimeout` al empezar una partida nueva.

## Estructura

```
mision-01/
├── index.html   # Estructura de la pagina
├── styles.css   # Tema visual y modo noche
├── app.js       # Logica del juego
└── README.md
```

## Tecnologias

HTML, CSS y JavaScript puro, sin frameworks ni librerias.

## Uso de IA

He usado Claude (Anthropic), a traves de Claude Code, como asistente.

### Que le pedi

- Primero le pedi que generase una version completa del juego para estudiarla. Despues decidi descartarla y reescribirlo yo paso a paso.
- En la reescritura, la IA escribio el HTML, el CSS, la seleccion de elementos, el objeto de estado y el listener de la tecla secreta.
- La logica del juego la escribi yo, funcion por funcion: la IA me explicaba que tenia que hacer cada funcion, revisaba mi codigo y me senalaba los errores.

### Que he cambiado

- Escribi `crearCarta`, `barajarCartas`, `repartirCartas`, `girarCarta`, `limpiarSeleccion`, `comprobarPareja`, `actualizarMarcador`, `finalPartida`, `nuevaPartida` y el listener del tablero.
- Corregi los errores que me senalo en la revision, por ejemplo usar `textContent` como funcion, el punto en `classList.add`, un `||` dentro del parentesis de `contains` o una llamada fuera del `setTimeout` que se ejecutaba antes de tiempo.
- La tecla secreta la elegi yo (`-`).

### Que entiendo

- Por que se usa un solo listener en el tablero y como `closest` encuentra la carta pulsada.
- La diferencia entre guardar el simbolo en `dataset` y mostrarlo con `textContent`.
- Por que `setTimeout` no espera y el codigo de despues se ejecuta antes, y para que sirve bloquear el tablero mientras tanto.
- Por que el estado vive en un objeto `const` aunque sus propiedades cambien.
- Como funciona el barajado de Fisher-Yates y por que se copia el array antes de barajarlo.
