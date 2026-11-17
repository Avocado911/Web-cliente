# Mision 2 · Forja de habitos 🔥

IA como pair · 90-120 min · nivel 2

Objetivo: gestor de habitos donde el estado vive en el padre y los hijos solo reciben datos y funciones.

Practicas: levantar el estado, flujo unidireccional, inmutabilidad, input controlado.

```
AppHabitos            ← duena del estado (array de habitos)
├── FormularioHabito  ← input controlado + «Anadir»
├── ListaHabitos      ← recibe habitos y funciones por props
│   └── TarjetaHabito ← «Hecho hoy» y «Eliminar»
└── PanelResumen      ← totales DERIVADOS
```

Fases: 1) version estatica con props · 2) estado arriba y «Hecho hoy» con `map` + spread · 3) anadir (`crypto.randomUUID()`) y eliminar (`filter`) · 4) resumen derivado («X de Y hoy», mejor racha).

## Criterios

- [ ] El array vive en un unico `useState` en el padre.
- [ ] Los hijos modifican el estado solo via funciones recibidas por props.
- [ ] Ninguna operacion muta: solo spread, `map` y `filter`.
- [ ] El formulario limpia el input tras anadir y rechaza habitos vacios.
- [ ] `PanelResumen` tiene cero `useState`.

## Retos

- [ ] Boton «Nuevo dia» (resetea `hechoHoy` y rompe la racha de los no completados).
- [ ] Mini-kanban «Pendientes / Completados» con dos `filter` sobre el mismo estado.
