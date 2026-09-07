import { test, expect, type Page } from "@playwright/test";

const screen = (page: Page, name: string) =>
  page.locator(`[data-screen-label="${name}"]`);
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
async function pick(page: Page, number: number) {
  await button(page, "Add Photo").click();
  await button(page, "Photo Library").click();
  await page
    .getByRole("button", { name: `Portrait ${number}`, exact: true })
    .click();
}
async function openLook(page: Page) {
  await page.locator(".look-card").first().click();
  await button(page, "Try This Look").click();
}
test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("library category and photo back stack survive navigation", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "See all", exact: true })
    .first()
    .click();
  await button(page, "Glam Waves").click();
  await page.locator(".look-card").first().click();
  await button(page, "Try This Look").click();
  await expect(button(page, "Continue")).toBeDisabled();
  await button(page, "Back").click();
  await expect(screen(page, "Look Detail")).toBeVisible();
  await button(page, "Back").click();
  await expect(button(page, "Glam Waves")).toHaveClass("active");
  await expect(page.locator(".look-card").first()).toContainText(
    "Hollywood Waves",
  );
});

test("result shows full image, original button toggles and uses its own photo snapshot", async ({
  page,
}) => {
  await openLook(page);
  await pick(page, 1);
  await expect(button(page, "Continue")).toBeEnabled();
  await button(page, "Continue").click();
  await expect(screen(page, "Generating")).toBeVisible();
  await expect(screen(page, "Result")).toBeVisible();
  await expect(page.locator(".compare,.divider")).toHaveCount(0);
  await expect(page.getByAltText("Generated look")).toBeVisible();
  await button(page, "View Original").click();
  await expect(page.getByAltText("Original photo")).toHaveAttribute(
    "src",
    /maya.webp$/,
  );
  await button(page, "View Result").click();
  await expect(page.getByAltText("Generated look")).toBeVisible();
  await page.locator(".look-card").first().click();
  await button(page, "Try This Look").click();
  await expect(page.getByAltText("Selected photo")).toHaveAttribute(
    "src",
    /maya.webp$/,
  );
  await pick(page, 2);
  await expect(page.getByAltText("Selected photo")).toHaveAttribute(
    "src",
    /theo.webp$/,
  );
  await button(page, "Continue").click();
  await expect(screen(page, "Result")).toBeVisible();
  await button(page, "Back").click();
  await button(page, "Back").click();
  await button(page, "View Original").click();
  await expect(page.getByAltText("Original photo")).toHaveAttribute(
    "src",
    /maya.webp$/,
  );
});

test("same look can save distinct generations; repeated Save stays idempotent", async ({
  page,
}) => {
  await openLook(page);
  await pick(page, 1);
  await button(page, "Continue").click();
  await button(page, "Save").click();
  await button(page, "Saved ✓").click();
  await button(page, "Back").click();
  await button(page, "Try This Look").click();
  await pick(page, 2);
  await button(page, "Continue").click();
  await button(page, "Save").click();
  await button(page, "Try Another Look").click();
  await button(page, "Me").click();
  await expect(page.locator(".creation-grid button")).toHaveCount(2);
  await button(page, "Hair Colors").click();
  await expect(page.getByText("No looks yet")).toBeVisible();
  await button(page, "Hairstyles").click();
  await expect(page.locator(".creation-grid button")).toHaveCount(2);
  await page.locator(".creation-grid button").first().click();
  await button(page, "Delete").click();
  await button(page, "Cancel").click();
  await expect(screen(page, "Creation Detail")).toBeVisible();
  await button(page, "Delete").click();
  await page
    .locator(".sheet")
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(page.locator(".creation-grid button")).toHaveCount(1);
});

test("hair color Camera flow stays independent and downloads give feedback", async ({
  page,
}) => {
  await page
    .locator(".rail-section")
    .last()
    .locator(".look-card")
    .first()
    .click();
  await expect(button(page, "Try This Look")).toHaveCount(0);
  await button(page, "Try This Color").click();
  await button(page, "Add Photo").click();
  await button(page, "Camera").click();
  await expect(page.getByAltText("Selected photo")).toHaveAttribute(
    "src",
    /lina.webp$/,
  );
  await button(page, "Continue").click();
  await button(page, "Download").click();
  await expect(page.getByRole("status")).toHaveText("Download started");
  await button(page, "Save").click();
  await button(page, "Try Another Color").click();
  await button(page, "Me").click();
  await button(page, "Hair Colors").click();
  await expect(page.locator(".creation-grid button")).toHaveCount(1);
});

for (const [index, shape, firstLook] of [
  [1, "Oval", "Butterfly Cut"],
  [2, "Round", "Face-Framing Layers"],
  [3, "Heart", "French Bob"],
  [4, "Square", "Soft Waves"],
  [5, "Diamond", "Soft Waves"],
  [6, "Oblong", "Hollywood Waves"],
] as const) {
  test(`face analysis ${shape} reuses photo directly in recommendations`, async ({
    page,
  }) => {
    await page.locator(".face-banner").click();
    await button(page, "Choose a Photo").click();
    await pick(page, index);
    const photo = await page.getByAltText("Selected photo").getAttribute("src");
    await button(page, "Continue").click();
    await expect(
      page.getByRole("heading", { name: shape, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".look-card").first()).toContainText(firstLook);
    await page.locator(".look-card").first().click();
    await button(page, "Back").click();
    await expect(screen(page, "Face Shape Result")).toBeVisible();
    await page.locator(".look-card").first().click();
    await button(page, "Try This Look").click();
    await expect(screen(page, "Generating")).toBeVisible();
    await expect(screen(page, "Photo Selection")).toHaveCount(0);
    await button(page, "View Original").click();
    await expect(page.getByAltText("Original photo")).toHaveAttribute(
      "src",
      photo!,
    );
  });
}

test("leaving analysis cancels pending work and allows a fresh analysis", async ({
  page,
}) => {
  await page.clock.install();
  await page.locator(".face-banner").click();
  await button(page, "Choose a Photo").click();
  await pick(page, 1);
  await button(page, "Continue").click();
  await expect(screen(page, "Face Shape Analyzing")).toBeVisible();
  await button(page, "Back").click();
  await page.locator(".face-banner").click();
  await page.clock.fastForward(2000);
  await expect(screen(page, "Face Shape Analysis")).toBeVisible();
  await button(page, "Choose a Photo").click();
  await expect(page.getByAltText("Selected photo")).toHaveAttribute(
    "src",
    /maya.webp$/,
  );
  await pick(page, 2);
  await button(page, "Continue").click();
  await page.clock.fastForward(1300);
  await expect(
    page.getByRole("heading", { name: "Round", exact: true }),
  ).toBeVisible();
  await button(page, "Analyze Another Photo").click();
  await expect(page.getByAltText("Selected photo")).toHaveAttribute(
    "src",
    /theo.webp$/,
  );
  await pick(page, 3);
  await button(page, "Continue").click();
  await page.clock.fastForward(1300);
  await expect(
    page.getByRole("heading", { name: "Heart", exact: true }),
  ).toBeVisible();
});

for (const width of [375, 390, 430]) {
  test(`mobile layout and local images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
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
    const fits = () =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      );
    expect(await fits()).toBe(true);
    await openLook(page);
    expect(await fits()).toBe(true);
    await expect(page.locator(".bottom-nav")).toHaveCount(0);
  });
}
