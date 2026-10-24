// Full-length smoke test with the browser's native clock and native animations.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const url = process.env.INTRO_TEST_URL || "http://localhost:3100";
const starts = [0, 3, 7, 10, 15, 20, 25];

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(url);
    await page.getByRole("button", { name: "PAUSAR", exact: true }).waitFor();
    const started = Date.now();
    const seen = new Set();
    let changedCaptions = new Set();
    while (Date.now() - started < 30500) {
      if (await page.locator('main[data-cover="true"]').count()) break;
      const progress = page.getByRole("progressbar");
      const second = Number(await progress.getAttribute("aria-valuenow"));
      const shot = Number(await page.locator("main").getAttribute("data-shot"));
      if (second >= starts[shot] + 1) {
        assert(await page.locator(`svg[data-art-scene="${shot}"]`).count(), `Missing native scene ${shot}`);
        seen.add(shot);
        const caption = await page.locator('[aria-live="polite"] p').textContent();
        changedCaptions.add(caption);
        assert(caption.length > 0);
        if (process.env.INTRO_SCREENSHOTS && !seen.has(`saved-${shot}`)) {
          await page.screenshot({ path: `${process.env.INTRO_SCREENSHOTS}/nova-native-shot-${shot}.png` });
          seen.add(`saved-${shot}`);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await page.getByRole("button", { name: "INICIAR AVENTURA" }).waitFor({ timeout: 5000 });
    await page.waitForFunction(() => {
      const title = document.getElementById("nova-title");
      return title && Number(getComputedStyle(title.parentElement).opacity) === 1;
    });
    const elapsed = Date.now() - started;
    assert(elapsed >= 29000 && elapsed <= 30000, `Intro exceeds the 30-second limit: ${elapsed}ms`);
    for (let i = 0; i < 7; i++) assert(seen.has(i), `Scene ${i} was not observed`);
    assert.equal(changedCaptions.size, 7, "The seven short story beats must all be readable");
    const title = page.getByRole("heading", { name: "QUANTUM NOVA" });
    assert.equal(await title.evaluate(el => Number(getComputedStyle(el.parentElement).opacity)), 1);
    assert.equal(await page.locator("svg[data-art-scene]").count(), 0);
    if (process.env.INTRO_SCREENSHOTS) await page.screenshot({ path: `${process.env.INTRO_SCREENSHOTS}/nova-native-cover.png` });
    await page.getByRole("button", { name: "INICIAR AVENTURA" }).click();
    await page.getByText("Unidades activas", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log(`PASS native mobile playback: ${(elapsed / 1000).toFixed(1)}s, 7 animated scenes, ${changedCaptions.size} subtitles, final cover and real game, no runtime errors`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
