# Ejercicio 12 · Primer proyecto con Vite (Vanilla + TypeScript)

## Como se ha creado

```bash
npm create vite@latest ejercicio-12 -- --template vanilla-ts
cd ejercicio-12
npm install      # lee package.json y crea node_modules/
npm run dev      # servidor en http://localhost:5173 con recarga al guardar (HMR)
npm run build    # version final en dist/
```

## package.json

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
},
"devDependencies": {
  "typescript": "~7.0.2",
  "vite": "^8.3.6"
}
```

- `dev`: arranca Vite en modo desarrollo. Traduce cada `.ts` a JS cuando el navegador lo pide y recarga al guardar.
- `build`: primero `tsc` comprueba los tipos (si hay un error de tipos, el build se para) y luego `vite build` junta y minimiza todo en `dist/`. Es como `gcc -O2`: sale la version final.
- `preview`: sirve lo que hay en `dist/` para comprobar que el build funciona antes de subirlo.
- No hay `dependencies`, solo `devDependencies`: TypeScript y Vite solo se usan mientras se programa. Lo que llega al navegador es el JS que hay en `dist/`, sin tipos.
- `~7.0.2` solo acepta parches (7.0.x); `^8.3.6` acepta cualquier 8.x igual o mayor, nunca la 9.

## Por que node_modules/ no se sube al repositorio

- Pesa 66 MB solo con Vite y TypeScript, frente a 76 KB de `dist/`.
- Se regenera entero con `npm install`, igual que los `.o` en C se regeneran con `make`.
- La receta exacta ya va en el repo: `package.json` (que librerias) y `package-lock.json` (que versiones exactas). Con eso cualquiera instala lo mismo.
- Algunos paquetes traen binarios compilados para cada sistema (Vite 8 usa Rolldown, que esta escrito en Rust): lo que se baja en Linux no sirve en Windows.
- Por eso la plantilla de Vite ya trae un `.gitignore` con `node_modules` y `dist`.

## Estructura

- `index.html`: el punto de entrada. Carga `src/main.ts` con `<script type="module">`.
- `src/main.ts`: pinta la pagina y llama a `setupCounter`.
- `src/counter.ts`: contador con tipos (`element: HTMLButtonElement`, `count: number`).
- `tsconfig.json`: opciones de TypeScript (modo `strict`, etc.).
- `public/`: ficheros que se copian tal cual a `dist/`.
