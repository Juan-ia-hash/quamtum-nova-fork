// Playwright is supplied externally through NODE_PATH, not added to game dependencies.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const url = process.env.INTRO_TEST_URL || "http://localhost:3100";
const storageKey = "quantum-nova:cinematic:v1";

async function visible(page, locator) {
  await locator.waitFor({ state: "visible" });
  const box = await locator.boundingBox();
  const size = page.viewportSize();
  assert(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= size.width + 1 && box.y + box.height <= size.height + 1, `Control outside viewport: ${await locator.textContent()}`);
}

async function advance(page, ms) {
  // Bounded clock steps also exercise dropped frames without thousands of CDP callbacks.
  for (let remaining = ms; remaining > 0; remaining -= 200) {
    await page.clock.fastForward(Math.min(200, remaining));
  }
  // Allow React to commit the time snapshot without advancing the virtual clock.
  await page.evaluate(() => new Promise(resolve => queueMicrotask(resolve)));
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [360, 640], [844, 390]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: width === 360 ? "reduce" : "no-preference" });
      await context.addInitScript(() => {
        // Chromium's native animation timeline is not controlled by Playwright's clock.
        // Use Framer's JS fallback for deterministic accelerated timeline assertions.
        delete Element.prototype.animate;
        const OriginalAudio = window.AudioContext;
        window.__introAudio = [];
        if (OriginalAudio) window.AudioContext = class extends OriginalAudio {
          constructor(...args) { super(...args); window.__introAudio.push(this); }
        };
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => { errors.push(error.message); console.error("PAGE ERROR:", error.message); });
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      // Install before Framer Motion initializes its monotonic clock.
      await page.clock.install();
      await page.goto(url);
      await page.getByRole("button", { name: "PAUSAR", exact: true }).waitFor();
      await page.clock.pauseAt(new Date(Date.now() + 100));
      assert.equal(await page.getByRole("button", { name: "Continuar", exact: true }).count(), 0);
      assert.equal(await page.evaluate(() => window.__introAudio.length), 0, "Audio started without a gesture");
      await page.getByRole("button", { name: "Sonido: silenciado" }).click();
      assert.equal(await page.getByRole("button", { name: "Sonido: activado" }).getAttribute("aria-pressed"), "true");
      await page.getByRole("button", { name: "PAUSAR", exact: true }).click();
      const beforePause = await page.getByRole("progressbar").getAttribute("aria-valuenow");
      await advance(page, 3000);
      assert.equal(await page.getByRole("progressbar").getAttribute("aria-valuenow"), beforePause);
      await page.getByRole("button", { name: "REANUDAR", exact: true }).click();

      let elapsed = 0;
      assert.equal(await page.getByRole("progressbar").getAttribute("aria-valuemax"), "29");
      for (const [second, shot] of [[1, 0], [5, 1], [8, 2], [13, 3], [17, 4], [22, 5], [27, 6]]) {
        await advance(page, (second - elapsed) * 1000);
        elapsed = second;
        assert.equal(await page.locator("main").getAttribute("data-shot"), String(shot));
        await visible(page, page.getByRole("button", { name: "SALTAR INTRODUCCIÓN" }));
        await visible(page, page.getByRole("button", { name: "PAUSAR", exact: true }));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Horizontal overflow");
        const subtitle = page.locator('[aria-live="polite"] p');
        await visible(page, subtitle);
        if (shot > 0) assert(!(await subtitle.textContent()).includes("vivían en paz"), "Subtitles stuck on the opening cue");
        assert(await page.locator(`svg[data-art-scene="${shot}"]`).count() > 0, "Art did not advance with the timeline");
        if (shot === 4) await page.getByText("Fenómeno ficticio de la historia del juego.", { exact: true }).waitFor();
        if (width === 360) {
          const animations = await page.locator("main").evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === "running" && a.constructor.name === "CSSAnimation").length);
          assert.equal(animations, 0, "Reduced motion still has running CSS animations");
        }
        if (process.env.INTRO_SCREENSHOTS && (width === 1440 || width === 390)) await page.screenshot({ path: `${process.env.INTRO_SCREENSHOTS}/nova-${width}-shot-${shot}.png` });
      }
      await advance(page, 3000); // Story and final crossfade both finish before 30 seconds.
      await visible(page, page.getByRole("button", { name: "INICIAR AVENTURA" }));
      await visible(page, page.getByRole("button", { name: "VOLVER A VER CINEMÁTICA" }));
      assert.equal(await page.locator("main").getAttribute("data-cover"), "true");
      assert.equal(await page.locator("svg[data-art-scene]").count(), 0, "Previous scene did not finish its exit");
      assert.equal(await page.getByRole("heading", { name: "QUANTUM NOVA" }).evaluate(el => Number(getComputedStyle(el.parentElement).opacity)), 1, "Title is still transparent");
      assert.equal(await page.evaluate(key => localStorage.getItem(key), storageKey), "seen");
      if (process.env.INTRO_SCREENSHOTS) await page.screenshot({ path: `${process.env.INTRO_SCREENSHOTS}/nova-cover-${width}.png` });
      await page.getByRole("button", { name: "Leer historia" }).click();
      await page.getByRole("dialog").waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog").count(), 0);
      await page.getByRole("button", { name: "VOLVER A VER CINEMÁTICA" }).click();
      assert.equal(await page.getByRole("progressbar").getAttribute("aria-valuenow"), "0");
      await page.getByRole("button", { name: "SALTAR INTRODUCCIÓN" }).click();
      await advance(page, 1500);
      await page.getByRole("button", { name: "INICIAR AVENTURA" }).click();
      await page.clock.resume();
      const battle = page.getByText("Unidades activas", { exact: true });
      await battle.waitFor();
      assert.equal(await page.locator("main").count(), 0, "Cinematic remains mounted during combat");
      assert(await page.evaluate(() => window.__introAudio.every(audio => audio.state === "closed")), "Audio was not released on unmount");

      if (width === 1440) {
        const cards = page.locator("div.group.cursor-pointer.select-none");
        assert(await cards.count() > 0, "No battle cards");
        await cards.first().hover();
        await cards.first().click();
        await page.getByRole("button", { name: /Confirmar objetivo/ }).click();
        const measure = page.getByRole("button", { name: /Medir/ });
        await measure.waitFor();
        assert(await measure.isEnabled());
        await measure.click();
        await page.getByText("2 / 20", { exact: true }).waitFor({ timeout: 15000 });
        console.log("PASS combat smoke: select card, target, measurement, attack/enemy cycle, turn 2");
      }
      await battle.evaluate(el => el.dataset.replayMarker = "preserved");
      await page.getByRole("button", { name: "Ver cinemática" }).click();
      await page.getByRole("button", { name: "SALTAR INTRODUCCIÓN" }).click();
      await page.getByRole("button", { name: "INICIAR AVENTURA" }).click();
      assert.equal(await battle.getAttribute("data-replay-marker"), "preserved");
      await page.reload();
      await page.getByRole("button", { name: "INICIAR AVENTURA" }).waitFor();
      assert.equal(await page.getByRole("button", { name: "SALTAR INTRODUCCIÓN" }).count(), 0, "Returning player should see the cover");
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`PASS ${width}x${height}: continuous 29s timeline (virtual clock), pause, captions, cover, replay, skip, persistence, cleanup`);
    }
    const context = await browser.newContext();
    await context.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error("Storage disabled"); };
      Storage.prototype.setItem = () => { throw new Error("Storage disabled"); };
    });
    const page = await context.newPage();
    await page.goto(url);
    await page.getByRole("button", { name: "SALTAR INTRODUCCIÓN" }).click();
    await page.getByRole("button", { name: "INICIAR AVENTURA" }).click();
    await page.getByText("Unidades activas", { exact: true }).waitFor();
    await context.close();
    console.log("PASS disabled localStorage: cover and game still work");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
