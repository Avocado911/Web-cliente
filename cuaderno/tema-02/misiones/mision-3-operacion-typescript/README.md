# Mision 3 · "Operacion TypeScript": la gran migracion 🛡️

Nivel 2 · IA como pair · 75 min

## Objetivo

Migrar el modulo de Aurora FM (mision 1) a un proyecto Vite (Vanilla + TypeScript) completamente tipado: el compilador detecta los errores antes de ejecutar.

**Practicas:** npm, `package.json`, Vite, tipos basicos, `interface`, uniones, `readonly` y genericos.

## Fases

1. **El andamio:** `npm create vite@latest aurora-fm`, `npm run dev`; localiza los scripts y el `.gitignore`.
2. **La forma de los datos:** `src/tipos.ts` con `interface Cancion` (`readonly id`) y `type CampoOrden`.
3. **Migracion:** `playlist.js` -> `src/playlist.ts`, todas las firmas anotadas.
4. **Rompe cosas a proposito:** `ordenarPor("precio")`, reasignar `id`, cancion sin `duracion`. Anota el mensaje exacto del editor.
5. **Un generico propio:** `ultima<T>(lista: T[]): T | undefined` con `Cancion[]` y con `string[]`.

## Criterios de aceptacion

- [ ] `npm run dev` levanta y `npm run build` compila sin errores.
- [ ] Todas las funciones publicas con tipos explicitos en parametros y retorno.
- [ ] Los tres errores provocados aparecen subrayados antes de ejecutar.
- [ ] `ultima` funciona con dos tipos distintos sin `any`.
- [ ] Ningun `any` en el proyecto.

## Retos extra

- [ ] `porGenero` como `Partial<Record<string, Cancion[]>>`.
- [ ] `type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string }` para `cargar()`.

Si el editor no marca errores: abre la carpeta del proyecto (donde vive `tsconfig.json`), no un fichero suelto. Logro: Guardian de tipos.

Nota: el proyecto de Vite se crea con `npm create vite@latest` dentro de esta carpeta cuando se empiece la mision.
