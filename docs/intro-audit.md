# Quantum Nova — auditoría e integración

## Revisión actual: introducción breve, mobile first

La secuencia se condensó a **29 segundos de historia y 0,6 segundos de fundido final**. Conserva paz, portales, guerra, Agencia, eliminación de nuevas realidades (Superadox), Rebelión y llamado al jugador. Los siete subtítulos son breves y la composición base es vertical; escritorio se amplía con `min-width`. No se cambió el videojuego ni sus dependencias para esta revisión.

Validación actual: build y TypeScript correctos; pruebas en cinco tamaños correctas; reproducción nativa móvil completa en **29,4 segundos**, con siete escenas y siete subtítulos, sin errores de consola. Las referencias a 90 segundos y 15 subtítulos que siguen documentan la versión anterior, no la duración actual.

## Estado inicial

- Framework: Next.js App Router, React 18, TypeScript estricto; rutas `/` y la página de error generada por Next. No existe `/game`.
- `src/app/page.tsx` ya montaba `GameEntry`, añadido en el trabajo local anterior. El repositorio público utiliza el mismo manifiesto de dependencias y su juego abre `BattleScreen` directamente. La introducción local anterior era manual y se llamaba Quantum Clash; se adaptó, sin reemplazar el videojuego.
- `src/components/` contiene batalla, HUD, cartas, enemigos, personajes y animaciones. `src/game/` contiene tipos, contenido, afinidades y el store Zustand. No se modificaron esos sistemas.
- Framer Motion ya anima `CharacterSprite`, `EnemyUnit`, `Card`, `CardHand`, `ResultOverlay` y otros componentes con `motion` y `AnimatePresence`.
- Zustand (`useGame`) conserva todo el combate. `BattleScreen` llama a `init()` solamente si no hay personajes. La cinemática usa estado React local y un MotionValue; no importa el store.
- Tailwind escanea `src/**/*`, define fuentes Rajdhani/Inter y animaciones del juego. No se cambió su configuración. Los estilos de la cinemática están en un CSS Module.
- `globals.css` aplica `overflow: hidden` al documento: la introducción gestiona sus áreas desplazables, carátula y transcripción dentro de su contenedor. No se modificaron estilos globales.
- Build y `npx tsc --noEmit` iniciales: correctos. Lint inicial: no ejecutable sin configurar ESLint; Next ofrece el asistente interactivo.

## Versiones efectivas, antes de desarrollar

| Paquete | Declarado | Instalado y lock |
| --- | --- | --- |
| Next.js | 14.2.5 | 14.2.5 |
| React / React DOM | ^18.3.1 | 18.3.1 |
| Framer Motion | ^11.3.19 | 11.18.2 |
| Zustand | ^4.5.4 | 4.5.7 |
| Tailwind | ^3.4.7 | 3.4.19 |
| TypeScript | ^5.5.4 | 5.9.3 |

Estas diferencias son resoluciones válidas de los rangos `^`, no actualizaciones realizadas para la cinemática. `npm ls --depth=0` inicial no detectó dependencias inválidas. El cambio previo de `package-lock.json` se conservó; no se instaló ni actualizó ninguna dependencia del proyecto.

SHA-256 inicial del lock: `7bc993f3adfd7e0d7b66fb74350806d92341e6671ae410d7a91f797c611a1d0b`.

## Skills y orientación

Se revisó e instaló `vercel-labs/skills@find-skills` mediante la CLI solicitada, con sus metadatos en `.agents/skills/find-skills/` y `skills-lock.json`, no en las dependencias npm. Se buscaron animación React, interfaces cinematográficas, rendimiento Next.js y accesibilidad.

Se consultaron las instrucciones oficiales de `vercel-react-best-practices`, `web-design-guidelines` (Vercel) y `frontend-design` (Anthropic), sin instalar otras skills redundantes. La fuente de Vercel se verificó como repositorio oficial y ampliamente utilizado. Se descartaron las recomendaciones que requerían GSAP, Remotion, React 19 o nuevos motores: no son necesarias ni adecuadas para este stack.

Aplicaciones concretas: SVG memoizado, un solo reloj que no provoca renders React por frame, transform/opacity para cámara y transiciones, limpieza de recursos, controles semánticos, pausa, transcripción, subtítulos y movimiento reducido.

## Arquitectura final

- `GameEntry`: persistencia versionada, carátula para jugadores recurrentes e integración mínima con `BattleScreen`. La partida permanece montada al repetir la historia.
- `QuantumNovaIntro`: composición a pantalla completa, cámara y transiciones; sin botones de avance de escenas.
- `CinematicTimeline`: 90 segundos de tiempo activo, compartidos por cámara, cortes, subtítulos y progreso. Cancela rAF al pausar, ocultar la pestaña o desmontar.
- `story`: siete tramos en 0/12/26/39/53/66/79/90 segundos y subtítulos sincronizados.
- `SceneArt` y `PortalEffect`: ilustraciones 2D/2.5D y portales originales, no vídeo prerenderizado ni película ilustrada por un estudio externo. IDs SVG únicos durante los fundidos.
- `IntroSubtitles`, `IntroTitleScreen`: narración en pantalla y carátula continua.
- `useIntroAudio`: ambiente sintetizado suave y opcional, creado solo tras gesto. Cierra el contexto al desmontar; no hay voz ni archivos musicales originales disponibles.

Pausar, ocultar la pestaña o abrir la transcripción detiene el tiempo activo. El cierre de la transcripción deja la reproducción pausada para que el usuario elija reanudar. Con movimiento reducido se mantienen historia, tiempos y controles, sin zoom ni bucles decorativos.

## Validación reproducible

Ver `tests/README.md`: suite de navegación en cinco tamaños, un turno real de combate, limpieza de audio, persistencia, almacenamiento bloqueado y una pasada de 90 segundos con reloj nativo. No se afirman pruebas en Safari ni dispositivos físicos.

Resultados en este entorno sobre el build de producción:

- Build final correcto; ruta `/` estática, 146 kB de JavaScript de primera carga frente a 143 kB de la introducción local anterior (cifras redondeadas de Next).
- TypeScript (`npx tsc --noEmit`) correcto antes y después.
- Suite acelerada: cinco tamaños correctos, incluidos móvil horizontal y movimiento reducido; inicio del juego, pausa, subtítulos, repetición, persistencia, audio y almacenamiento bloqueado correctos.
- Smoke de combate correcto: carta, objetivo, medición, ciclo de ataque/enemigo y llegada al turno 2. Es una comprobación funcional, no cobertura exhaustiva de todas las cartas ni del balance.
- Pasada final con reloj nativo: 92,2 s incluyendo fundido final y espera de comprobación; siete escenas, 15 subtítulos y entrada al juego correctos, sin errores de ejecución ni de consola.
- `npm ls --depth=0` final correcto, versiones sin cambios; SHA-256 del lock idéntico al inicial.
- Lint final sigue bloqueado por ausencia de configuración ESLint. No se afirma que haya pasado.

Limitaciones: no hay locución grabada, vídeo prerenderizado ni música de estudio; el resultado es una cinemática SVG/CSS/Framer Motion original con ambiente Web Audio opcional. No se verificaron Safari/iOS/Android físicos ni un benchmark de FPS en hardware de gama baja.
