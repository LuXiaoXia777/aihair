import { test, expect, type Page } from "@playwright/test";
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
const screen = (page: Page, name: string) =>
  page.locator(`[data-screen-label="${name}"]`);
const tab = (page: Page, name: string) =>
  page.getByRole("navigation").getByRole("button", { name, exact: true });
async function addPhoto(page: Page, slot: string, photo = "Portrait 1") {
  await page
    .getByRole("button", { name: new RegExp(`^(Add|Replace) ${slot} photo$`) })
    .click();
  await button(page, "Photo Library").click();
  await button(page, photo).click();
}
async function createAI(
  page: Page,
  entry = "Create My AI",
  photo = "Portrait 1",
) {
  await button(page, entry).click();
  await button(page, "Start").click();
  for (const slot of ["Front", "Left", "Right"])
    await addPhoto(page, slot, photo);
  await button(page, "Continue").click();
  await expect(button(page, "Checking your photos...")).toBeVisible();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await expect(screen(page, "AI Profile Created")).toBeVisible();
  await button(page, "Use This AI").click();
  await expect(screen(page, "Analyzing Face")).toBeVisible();
  await page.clock.fastForward(1100);
  await expect(screen(page, "Face Shape Result")).toBeVisible();
}
async function setup(page: Page) {
  await createAI(page);
  await button(page, "Explore Looks").click();
}
async function generate(page: Page) {
  await button(page, "Generate").click();
  await expect(screen(page, "Generating")).toBeVisible();
  await expect(screen(page, "Add 3 Photos")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.clock.fastForward(1300);
  await expect(screen(page, "Result")).toBeVisible();
}
async function backExplore(page: Page) {
  await button(page, "Back").click();
  await button(page, "Back").click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("./");
});

test("A: first-use gate, three photos, identity, automatic face analysis and Explore return", async ({
  page,
}) => {
  await expect(page.locator(".look-card")).toHaveCount(0);
  await expect(page.getByRole("navigation").getByRole("button")).toHaveText([
    "Explore",
    "My AI",
    "Creations",
  ]);
  await tab(page, "My AI").click();
  await expect(button(page, "Create My AI")).toBeVisible();
  await tab(page, "Creations").click();
  await expect(page.getByText("No creations yet")).toBeVisible();
  await screen(page, "Creations")
    .getByRole("button", { name: "Explore", exact: true })
    .click();
  await createAI(page);
  await expect(
    page.getByRole("heading", { name: "Oval", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".look-card")).toHaveCount(5);
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await button(page, "Explore Looks").click();
  await expect(page.locator(".rail-section")).toHaveCount(7);
  await expect(button(page, "Switch AI, current Luna")).toBeVisible();
  await expect(tab(page, "Explore")).toHaveAttribute("aria-current", "page");
});

test("three-photo validation, per-slot replacement, library cancel and Camera mock", async ({
  page,
}) => {
  await button(page, "Create My AI").click();
  await button(page, "Start").click();
  await expect(button(page, "Continue")).toBeDisabled();
  await button(page, "Add Front photo").click();
  await button(page, "Cancel").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await addPhoto(page, "Front", "Blurry photo");
  await addPhoto(page, "Left");
  await expect(button(page, "Continue")).toBeDisabled();
  await button(page, "Add Right photo").click();
  await button(page, "Camera").click();
  await expect(page.getByAltText("Right photo")).toHaveAttribute(
    "src",
    /lina.webp$/,
  );
  await expect(button(page, "Continue")).toBeEnabled();
  await button(page, "Continue").click();
  await page.clock.fastForward(500);
  await expect(page.getByRole("alert")).toHaveCount(1);
  await expect(button(page, "Replace Front photo")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(button(page, "Replace Left photo")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await button(page, "Replace Front photo").click();
  await button(page, "Photo Library").click();
  await button(page, "Close").click();
  await expect(page.getByRole("dialog", { name: "Add Photo" })).toBeVisible();
  await page.keyboard.press("Escape");
  await addPhoto(page, "Front", "Portrait 2");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByAltText("Left photo")).toHaveAttribute(
    "src",
    /maya.webp$/,
  );
  await button(page, "Continue").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
});

test("B: hairstyle generates without uploads; result-only Save and Regenerate", async ({
  page,
}) => {
  await setup(page);
  await button(page, "Butterfly Cut").first().click();
  await expect(page.getByText("Using Luna")).toBeVisible();
  await generate(page);
  await expect(page.locator(".result-image")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /View Original|View Result/ }),
  ).toHaveCount(0);
  await expect(page.locator(".compare,.divider,.original-toggle")).toHaveCount(
    0,
  );
  await button(page, "Save").click();
  await expect(page.getByRole("status")).toHaveText("Saved to Creations");
  await button(page, "Saved ✓").click();
  await button(page, "Regenerate").click();
  await expect(screen(page, "Generating")).toBeVisible();
  await page.clock.fastForward(1300);
  await button(page, "Save").click();
  await backExplore(page);
  await tab(page, "Creations").click();
  await expect(page.locator(".creation-grid button")).toHaveCount(2);
  await expect(page.locator(".creation-grid")).toContainText("Luna");
});

test("C: My AI recommendations and face-result return stack", async ({
  page,
}) => {
  await setup(page);
  await tab(page, "My AI").click();
  await expect(
    page.getByRole("heading", { name: "Oval", exact: true }),
  ).toBeVisible();
  await button(page, "See All").click();
  await button(page, "Soft Waves").click();
  await button(page, "Back").click();
  await expect(screen(page, "Face Shape Result")).toBeVisible();
  await button(page, "Soft Waves").click();
  await generate(page);
  await button(page, "Save").click();
  await button(page, "Back").click();
  await button(page, "Back").click();
  await button(page, "Go to My AI").click();
  await expect(screen(page, "My AI")).toBeVisible();
});

for (const [name, section, filter, label] of [
  ["Pink", "Trending Hair Colors", "Hair Colors", "Hair Color"],
  ["Dreamy", "AI Portraits", "Portraits", "Portrait"],
] as const) {
  test(`D/E: ${label} detail, generate, save, filter and creation Regenerate`, async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByRole("region", { name: section, exact: true })
      .getByRole("button", { name, exact: true })
      .click();
    await generate(page);
    await button(page, "Save").click();
    await backExplore(page);
    await tab(page, "Creations").click();
    await button(page, filter).click();
    await expect(page.locator(".creation-grid button")).toHaveCount(1);
    await button(page, `${name}, Luna`).click();
    await expect(page.getByText(label, { exact: true })).toBeVisible();
    await button(page, "Regenerate").click();
    await expect(screen(page, "Template Detail")).toBeVisible();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await button(page, "Back").click();
    await expect(screen(page, "Creation Detail")).toBeVisible();
  });
}

test("F/G: second AI, origin return, switching everywhere and immutable creation association", async ({
  page,
}) => {
  await setup(page);
  await tab(page, "My AI").click();
  await createAI(page, "New AI", "Portrait 2");
  await expect(
    page.getByRole("heading", { name: "Round", exact: true }),
  ).toBeVisible();
  await button(page, "Go to My AI").click();
  await expect(
    page.getByRole("heading", { name: "Emma", exact: true }),
  ).toBeVisible();
  await button(page, "Switch AI").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Luna Oval", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Luna", exact: true }),
  ).toBeVisible();
  await button(page, "Emma").click();
  await expect(
    page.getByRole("heading", { name: "Emma", exact: true }),
  ).toBeVisible();
  await tab(page, "Explore").click();
  await button(page, "Switch AI, current Emma").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Luna Oval", exact: true })
    .click();
  await button(page, "Switch AI, current Luna").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Emma Round", exact: true })
    .click();
  await button(page, "Butterfly Cut").first().click();
  await expect(page.getByText("Using Emma")).toBeVisible();
  await generate(page);
  await expect(page.getByText("Using Emma")).toBeVisible();
  await button(page, "Save").click();
  await backExplore(page);
  await button(page, "Switch AI, current Emma").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Luna Oval", exact: true })
    .click();
  await tab(page, "Creations").click();
  await button(page, "Butterfly Cut, Emma").click();
  await expect(page.getByText("Emma", { exact: true })).toBeVisible();
  await button(page, "Regenerate").click();
  await expect(page.getByText("Using Luna")).toBeVisible();
});

test("H: Download feedback, delete cancel, confirm and Creations back", async ({
  page,
}) => {
  await setup(page);
  await button(page, "Butterfly Cut").first().click();
  await generate(page);
  await button(page, "Save").click();
  await backExplore(page);
  await tab(page, "Creations").click();
  await button(page, "Butterfly Cut, Luna").click();
  await button(page, "Back").click();
  await expect(screen(page, "Creations")).toBeVisible();
  await button(page, "Butterfly Cut, Luna").click();
  await button(page, "Download").click();
  await expect(page.getByRole("status")).toHaveText("Download started");
  await button(page, "Delete").click();
  await button(page, "Cancel").click();
  await expect(screen(page, "Creation Detail")).toBeVisible();
  await button(page, "Delete").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(screen(page, "Creations")).toBeVisible();
  await expect(page.getByText("No creations yet")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Creation deleted");
});

test("libraries and categories change real content and preserve return state", async ({
  page,
}) => {
  await setup(page);
  for (const section of [
    "Trending Now",
    "Glam Waves",
    "Sleek & Straight",
    "Face-Framing",
    "Chic Short Hair",
    "Trending Hair Colors",
    "AI Portraits",
  ]) {
    await button(page, `See All ${section}`).click();
    await expect(screen(page, "Library")).toBeVisible();
    const categories = await page
      .locator(".category-tabs button")
      .allTextContents();
    for (const category of categories) {
      await page.locator(".category-tabs").getByRole("button", { name: category, exact: true }).click();
      await expect(page.locator(".category-tabs").getByRole("button", { name: category, exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      const cards = page.locator(".library-grid .look-card");
      expect(await cards.count()).toBeGreaterThan(0);
      const title = await cards.first().getAttribute("aria-label");
      await cards.first().click();
      await expect(
        page.getByRole("heading", { name: title!, exact: true }),
      ).toBeVisible();
      await button(page, "Back").click();
      await expect(page.locator(".category-tabs").getByRole("button", { name: category, exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    await button(page, "Back").click();
  }
});

test("all template cards, Similar and More Like This open the correct same-type detail", async ({
  page,
}) => {
  await setup(page);
  const sections = page.locator(".rail-section");
  const names: string[] = [];
  for (const section of await sections.all())
    names.push(
      ...(await section
        .locator(".look-card")
        .evaluateAll((cards) =>
          cards.map((card) => card.getAttribute("aria-label")!),
        )),
    );
  for (const name of [...new Set(names)]) {
    await button(page, name).first().click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await button(page, "Back").click();
  }
  await button(page, "Dreamy").click();
  await button(page, "Classic").click();
  await expect(
    page.getByRole("heading", { name: "Classic", exact: true }),
  ).toBeVisible();
  await generate(page);
  await button(page, "Editorial").click();
  await expect(
    page.getByRole("heading", { name: "Editorial", exact: true }),
  ).toBeVisible();
  await button(page, "Back").click();
  await expect(screen(page, "Result")).toBeVisible();
});

for (const [photo, shape, first] of [
  [1, "Oval", "Butterfly Cut"],
  [2, "Round", "Face-Framing Layers"],
  [3, "Heart", "French Bob"],
  [4, "Square", "Soft Waves"],
  [5, "Diamond", "Soft Waves"],
  [6, "Oblong", "Hollywood Waves"],
] as const) {
  test(`face mapping ${shape}`, async ({ page }) => {
    await createAI(page, "Create My AI", `Portrait ${photo}`);
    await expect(
      page.getByRole("heading", { name: shape, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".look-card").first()).toHaveAttribute(
      "aria-label",
      first,
    );
    expect(await page.locator(".look-card").count()).toBeGreaterThanOrEqual(4);
  });
}

test("generation and setup timers cancel on Back without late navigation", async ({
  page,
}) => {
  await button(page, "Create My AI").click();
  await button(page, "Back").click();
  await expect(screen(page, "Explore")).toBeVisible();
  await button(page, "Create My AI").click();
  await button(page, "Start").click();
  for (const slot of ["Front", "Left", "Right"]) await addPhoto(page, slot);
  await button(page, "Continue").click();
  await button(page, "Back").click();
  await page.clock.fastForward(2500);
  await expect(screen(page, "Add 3 Photos")).toBeVisible();
  await button(page, "Continue").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await button(page, "Back").click();
  await page.clock.fastForward(2500);
  await expect(screen(page, "Add 3 Photos")).toBeVisible();
  await button(page, "Continue").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await button(page, "Use This AI").click();
  await button(page, "Back").click();
  await page.clock.fastForward(2500);
  await expect(screen(page, "AI Profile Created")).toBeVisible();
  await button(page, "Use This AI").click();
  await page.clock.fastForward(1100);
  await button(page, "Explore Looks").click();
  await button(page, "Butterfly Cut").first().click();
  await button(page, "Generate").click();
  await button(page, "Back").click();
  await page.clock.fastForward(3000);
  await expect(screen(page, "Template Detail")).toBeVisible();
});

test("Create Another and Switch sheet New AI both create usable profiles", async ({
  page,
}) => {
  await button(page, "Create My AI").click();
  await button(page, "Start").click();
  for (const slot of ["Front", "Left", "Right"]) await addPhoto(page, slot);
  await button(page, "Continue").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await createAI(page, "Create Another", "Portrait 2");
  await button(page, "Explore Looks").click();
  await button(page, "Switch AI, current Emma").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Luna Ready to use", exact: true })
    .click();
  await expect(screen(page, "Analyzing Face")).toBeVisible();
  await page.clock.fastForward(1100);
  await button(page, "Explore Looks").click();
  await button(page, "Switch AI, current Luna").click();
  await createAI(page, "Create New AI", "Portrait 3");
  await button(page, "Explore Looks").click();
  await expect(button(page, "Switch AI, current Alex")).toBeVisible();
});

for (const width of [375, 390, 430]) {
  test(`responsive ${width}px, image loading and root-only navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const fits = () =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    expect(await fits()).toBe(true);
    await page.screenshot({
      path: `test-results/gate-${width}.png`,
      fullPage: true,
    });
    await setup(page);
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    expect(await fits()).toBe(true);
    await page.screenshot({
      path: `test-results/explore-${width}.png`,
      fullPage: true,
    });
    await tab(page, "My AI").click();
    expect(await fits()).toBe(true);
    await page.screenshot({
      path: `test-results/my-ai-${width}.png`,
      fullPage: true,
    });
    await button(page, "Soft Waves").click();
    await expect(page.getByRole("navigation")).toHaveCount(0);
    await generate(page);
    await expect(page.getByRole("navigation")).toHaveCount(0);
    expect(await fits()).toBe(true);
    await page.screenshot({
      path: `test-results/result-${width}.png`,
      fullPage: true,
    });
  });
}
