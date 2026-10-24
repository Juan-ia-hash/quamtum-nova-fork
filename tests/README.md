# Pruebas de la cinemática de Quantum Nova

1. Ejecutar `npm.cmd run build` y `npm.cmd run start -- --port 3100`.
2. Tener `playwright` y Chromium disponibles (pueden instalarse fuera del repositorio para no modificar sus dependencias).
3. Ejecutar `node tests/intro.browser.cjs` y `node tests/intro.realtime.cjs`. Si Playwright es externo, definir `NODE_PATH` con la carpeta `node_modules` que lo contiene. No hace falta añadirlo al `package.json` del juego.

Variables opcionales: `INTRO_TEST_URL` cambia el servidor; `INTRO_SCREENSHOTS` guarda capturas en un directorio existente.

`intro.browser.cjs` verifica la línea de tiempo de 29 segundos con un reloj virtual, pausa, subtítulos, ilustraciones correctas, controles visibles, ausencia de desbordamiento horizontal, carátula, inicio del combate, persistencia, repetición sin desmontar el combate, sonido activado por gesto y liberación del AudioContext, movimiento reducido y almacenamiento bloqueado. También selecciona una carta, confirma un objetivo y ejecuta un turno hasta el turno 2.

El reloj virtual de Playwright no controla la línea de tiempo nativa de Web Animations. En esta suite se deshabilita esa API **solo dentro del navegador de prueba**, antes de cargar Framer Motion, para comprobar su fallback JavaScript de forma determinista. No se modifica el código de producción para acelerar el tiempo.

`intro.realtime.cjs` ejecuta la introducción completa sin reloj simulado y con las animaciones nativas de Chromium. Exige terminar en menos de 30 segundos, incluido el fundido de la carátula. Comprueba siete escenas, siete subtítulos completos y entrada al juego desde un viewport móvil.

Tamaños de la suite: 1440×900, 768×1024, 390×844, 360×640 (movimiento reducido) y 844×390. Estas pruebas no sustituyen pruebas en dispositivos físicos o Safari. `npm run lint` sigue requiriendo una configuración ESLint que el proyecto no incluye; no se instalaron dependencias para alterarlo.
