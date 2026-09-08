import { test, expect, type Page } from "@playwright/test";
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
const screen = (page: Page, name: string) =>
  page.locator(`[data-screen-label="${name}"]`);
const tab = (page: Page, name: string) =>
  page.getByRole("navigation").getByRole("button", { name, exact: true });
async function addPhoto(page: Page, slot: string, photo = "示例照片 1") {
  await page
    .getByRole("button", { name: new RegExp(`^(添加|更换)${slot}照片$`) })
    .click();
  await button(page, photo).click();
}
async function startTemplateSetup(page: Page) {
  await button(page, "蝴蝶层次剪").first().click();
  await button(page, "应用").click();
}
async function finishToExplore(page: Page) {
  const resume = page.getByRole("button", { name: /^返回应用/ });
  if (await resume.count()) {
    await resume.click();
    await button(page, "返回").click();
  } else await button(page, "去发现新造型").click();
}
async function createAI(
  page: Page,
  entry = "创建我的分身",
  photo = "示例照片 1",
) {
  if (entry === "创建我的分身" && !(await screen(page, "我的分身").count())) await startTemplateSetup(page);
  else await button(page, entry).click();

  for (const slot of ["正面", "左侧面", "右侧面"])
    await addPhoto(page, slot, photo);
  await button(page, "下一步").click();
  await expect(button(page, "正在检查照片…")).toBeVisible();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await expect(screen(page, "AI Profile Created")).toBeVisible();
  await button(page, "使用这个分身").click();
  await expect(screen(page, "Analyzing Face")).toBeVisible();
  await page.clock.fastForward(1100);
  await expect(screen(page, "脸型与推荐")).toBeVisible();
}
async function setup(page: Page) {
  await createAI(page);
  await finishToExplore(page);
}
async function generate(page: Page) {
  await button(page, "应用").click();
  await expect(screen(page, "Generating")).toBeVisible();
  await expect(screen(page, "添加三张照片")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.clock.fastForward(1300);
  await expect(screen(page, "Result")).toBeVisible();
}
async function backExplore(page: Page) {
  await button(page, "返回").click();
  await button(page, "返回").click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("./");
});

test("A: first-use gate, three photos, identity, automatic face analysis and 发现 return", async ({
  page,
}) => {
  expect(await page.locator(".look-card").count()).toBeGreaterThan(0);
  await expect(page.getByRole("navigation").getByRole("button")).toHaveText([
    "发现",
    "我的分身",
    "作品",
  ]);
  await tab(page, "我的分身").click();
  await expect(button(page, "创建我的分身")).toBeVisible();
  await tab(page, "作品").click();
  await expect(page.getByText("还没有作品")).toBeVisible();
  await screen(page, "作品")
    .getByRole("button", { name: "发现", exact: true })
    .click();
  await createAI(page);
  await expect(
    page.getByRole("heading", { name: "椭圆脸", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".look-card")).toHaveCount(5);
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await finishToExplore(page);
  await expect(page.locator(".rail-section")).toHaveCount(7);
  await expect(button(page, "切换分身，当前小月")).toBeVisible();
  await expect(tab(page, "发现")).toHaveAttribute("aria-current", "page");
});

test("three-photo validation, direct library and per-slot replacement", async ({
  page,
}) => {
  await startTemplateSetup(page);

  await expect(button(page, "下一步")).toBeDisabled();
  await button(page, "添加正面照片").click();
  await expect(page.getByRole("dialog", {name: "从相册选择"})).toBeVisible();
  await expect(button(page, "相机拍照")).toHaveCount(0);
  await button(page, "关闭").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await addPhoto(page, "正面", "模糊照片");
  await addPhoto(page, "左侧面");
  await expect(button(page, "下一步")).toBeDisabled();
  await addPhoto(page, "右侧面", "示例照片 3");
  await expect(page.getByAltText("右侧面照片")).toHaveAttribute(
    "src",
    /lina.webp$/,
  );
  await expect(button(page, "下一步")).toBeEnabled();
  await button(page, "下一步").click();
  await page.clock.fastForward(500);
  await expect(page.getByRole("alert")).toHaveCount(1);
  await expect(button(page, "更换正面照片")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(button(page, "更换左侧面照片")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await button(page, "更换正面照片").click();
  await button(page, "关闭").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await button(page, "更换正面照片").click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await addPhoto(page, "正面", "示例照片 2");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByAltText("左侧面照片")).toHaveAttribute(
    "src",
    /maya.webp$/,
  );
  await button(page, "下一步").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
});

test("B: hairstyle generates without uploads; result-only 保存到作品 and 重新生成", async ({
  page,
}) => {
  await setup(page);
  await button(page, "蝴蝶层次剪").first().click();
  await expect(page.getByText("当前分身：小月")).toBeVisible();
  await generate(page);
  await expect(page.locator(".result-image")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /View Original|View Result/ }),
  ).toHaveCount(0);
  await expect(page.locator(".compare,.divider,.original-toggle")).toHaveCount(
    0,
  );
  await button(page, "保存到作品").click();
  await expect(page.getByRole("status")).toHaveText("已保存到作品");
  await button(page, "已保存 ✓").click();
  await button(page, "重新生成").click();
  await expect(screen(page, "Generating")).toBeVisible();
  await page.clock.fastForward(1300);
  await button(page, "保存到作品").click();
  await backExplore(page);
  await tab(page, "作品").click();
  await expect(page.locator(".creation-grid button")).toHaveCount(2);
  await expect(page.locator(".creation-grid")).toContainText("小月");
});

test("C: 我的分身 recommendations and face-result return stack", async ({
  page,
}) => {
  await setup(page);
  await tab(page, "我的分身").click();
  await expect(
    page.getByRole("heading", { name: "椭圆脸", exact: true }),
  ).toBeVisible();
  await button(page, "查看全部").click();
  await button(page, "自然微卷").click();
  await button(page, "返回").click();
  await expect(screen(page, "脸型与推荐")).toBeVisible();
  await button(page, "自然微卷").click();
  await generate(page);
  await button(page, "保存到作品").click();
  await button(page, "返回").click();
  await button(page, "返回").click();
  await button(page, "返回我的分身").click();
  await expect(screen(page, "我的分身")).toBeVisible();
});

for (const [name, section, label] of [
  ["樱花粉", "流行发色", "发色"],
  ["梦幻光影", "艺术照", "艺术照"],
] as const) {
  test(`D/E: ${label} detail, generate, save, filter and creation 重新生成`, async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByRole("region", { name: section, exact: true })
      .getByRole("button", { name, exact: true })
      .click();
    await generate(page);
    await button(page, "保存到作品").click();
    await backExplore(page);
    await tab(page, "作品").click();
    await expect(page.locator(".filter-tabs")).toHaveCount(0);
    await expect(page.locator(".creation-grid button")).toHaveCount(1);
    await button(page, `${name}, 小月`).click();
    await expect(page.getByText(label, { exact: true })).toBeVisible();
    await button(page, "重新生成").click();
    await expect(screen(page, "Template Detail")).toBeVisible();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await button(page, "返回").click();
    await expect(screen(page, "Creation Detail")).toBeVisible();
  });
}

test("F/G: second AI, origin return, switching everywhere and immutable creation association", async ({
  page,
}) => {
  await setup(page);
  await tab(page, "我的分身").click();
  await createAI(page, "新建分身", "示例照片 2");
  await expect(
    page.getByRole("heading", { name: "圆脸", exact: true }),
  ).toBeVisible();
  await button(page, "返回我的分身").click();
  await expect(
    page.getByRole("heading", { name: "小夏", exact: true }),
  ).toBeVisible();
  await button(page, "切换分身").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "小月 椭圆脸", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "小月", exact: true }),
  ).toBeVisible();
  await button(page, "小夏").click();
  await expect(
    page.getByRole("heading", { name: "小夏", exact: true }),
  ).toBeVisible();
  await tab(page, "发现").click();
  await button(page, "切换分身，当前小夏").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "小月 椭圆脸", exact: true })
    .click();
  await button(page, "切换分身，当前小月").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "小夏 圆脸", exact: true })
    .click();
  await button(page, "蝴蝶层次剪").first().click();
  await expect(page.getByText("当前分身：小夏")).toBeVisible();
  await generate(page);
  await expect(page.getByText("当前分身：小夏")).toBeVisible();
  await button(page, "保存到作品").click();
  await backExplore(page);
  await button(page, "切换分身，当前小夏").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "小月 椭圆脸", exact: true })
    .click();
  await tab(page, "作品").click();
  await button(page, "蝴蝶层次剪, 小夏").click();
  await expect(page.getByText("小夏", { exact: true })).toBeVisible();
  await button(page, "重新生成").click();
  await expect(page.getByText("当前分身：小月")).toBeVisible();
});

test("H: 下载图片 feedback, delete cancel, confirm and 作品 back", async ({
  page,
}) => {
  await setup(page);
  await button(page, "蝴蝶层次剪").first().click();
  await generate(page);
  await button(page, "保存到作品").click();
  await backExplore(page);
  await tab(page, "作品").click();
  await button(page, "蝴蝶层次剪, 小月").click();
  await button(page, "返回").click();
  await expect(screen(page, "作品")).toBeVisible();
  await button(page, "蝴蝶层次剪, 小月").click();
  await button(page, "下载图片").click();
  await expect(page.getByRole("status")).toHaveText("下载演示已完成");
  await button(page, "删除作品").click();
  await button(page, "取消").click();
  await expect(screen(page, "Creation Detail")).toBeVisible();
  await button(page, "删除作品").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "删除作品", exact: true })
    .click();
  await expect(screen(page, "作品")).toBeVisible();
  await expect(page.getByText("还没有作品")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("作品已删除");
});

test("libraries and categories change real content and preserve return state", async ({
  page,
}) => {
  await setup(page);
  for (const section of [
    "人气发型",
    "蓬松卷发",
    "柔顺直发",
    "修饰脸型",
    "气质短发",
    "流行发色",
    "艺术照",
  ]) {
    await button(page, `查看全部${section}`).click();
    await expect(screen(page, "Library")).toBeVisible();
    const categories = await page
      .locator(".category-tabs button")
      .allTextContents();
    for (const category of categories) {
      await page
        .locator(".category-tabs")
        .getByRole("button", { name: category, exact: true })
        .click();
      await expect(
        page
          .locator(".category-tabs")
          .getByRole("button", { name: category, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      const cards = page.locator(".library-grid .look-card");
      expect(await cards.count()).toBeGreaterThan(0);
      const title = await cards.first().getAttribute("aria-label");
      await cards.first().click();
      await expect(
        page.getByRole("heading", { name: title!, exact: true }),
      ).toBeVisible();
      await button(page, "返回").click();
      await expect(
        page
          .locator(".category-tabs")
          .getByRole("button", { name: category, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    }
    await button(page, "返回").click();
  }
});

test("all template cards, Similar and 试试其他风格 open the correct same-type detail", async ({
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
    await button(page, "返回").click();
  }
  await button(page, "梦幻光影").click();
  await button(page, "经典肖像").click();
  await expect(
    page.getByRole("heading", { name: "经典肖像", exact: true }),
  ).toBeVisible();
  await generate(page);
  await button(page, "时尚大片").click();
  await expect(
    page.getByRole("heading", { name: "时尚大片", exact: true }),
  ).toBeVisible();
  await button(page, "返回").click();
  await expect(screen(page, "Result")).toBeVisible();
});

for (const [photo, shape, first] of [
  [1, "椭圆脸", "蝴蝶层次剪"],
  [2, "圆脸", "修颜层次剪"],
  [3, "心形脸", "法式波波头"],
  [4, "方脸", "自然微卷"],
  [5, "菱形脸", "自然微卷"],
  [6, "长脸", "复古大波浪"],
] as const) {
  test(`face mapping ${shape}`, async ({ page }) => {
    await createAI(page, "创建我的分身", `示例照片 ${photo}`);
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

test("generation and setup timers cancel on 返回 without late navigation", async ({
  page,
}) => {
  await startTemplateSetup(page);
  await button(page, "返回").click();
  await expect(screen(page, "Template Detail")).toBeVisible();
  await button(page, "返回").click();
  await expect(screen(page, "发现")).toBeVisible();
  await startTemplateSetup(page);

  for (const slot of ["正面", "左侧面", "右侧面"]) await addPhoto(page, slot);
  await button(page, "下一步").click();
  await button(page, "返回").click();
  await page.clock.fastForward(2500);
  await expect(screen(page, "添加三张照片")).toBeVisible();
  await button(page, "下一步").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await button(page, "返回").click();
  await page.clock.fastForward(2500);
  await expect(screen(page, "添加三张照片")).toBeVisible();
  await button(page, "下一步").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await button(page, "使用这个分身").click();
  await button(page, "返回").click();
  await page.clock.fastForward(2500);
  await expect(screen(page, "AI Profile Created")).toBeVisible();
  await button(page, "使用这个分身").click();
  await page.clock.fastForward(1100);
  await finishToExplore(page);
  await button(page, "蝴蝶层次剪").first().click();
  await button(page, "应用").click();
  await button(page, "返回").click();
  await page.clock.fastForward(3000);
  await expect(screen(page, "Template Detail")).toBeVisible();
});

test("再创建一个 and Switch sheet 新建分身 both create usable profiles", async ({
  page,
}) => {
  await startTemplateSetup(page);

  for (const slot of ["正面", "左侧面", "右侧面"]) await addPhoto(page, slot);
  await button(page, "下一步").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await createAI(page, "再创建一个", "示例照片 2");
  await finishToExplore(page);
  await button(page, "切换分身，当前小夏").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "小月 待使用", exact: true })
    .click();
  await expect(screen(page, "Analyzing Face")).toBeVisible();
  await page.clock.fastForward(1100);
  await finishToExplore(page);
  await button(page, "切换分身，当前小月").click();
  await createAI(page, "新建分身", "示例照片 3");
  await finishToExplore(page);
  await expect(button(page, "切换分身，当前小林")).toBeVisible();
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
    await tab(page, "我的分身").click();
    expect(await fits()).toBe(true);
    await page.screenshot({
      path: `test-results/my-ai-${width}.png`,
      fullPage: true,
    });
    await button(page, "自然微卷").click();
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

test("guided camera captures front, left and right with retake and confirmation", async ({
  page,
}) => {
  await startTemplateSetup(page);

  await expect(button(page, "拍摄三张照片")).toBeVisible();
  await button(page, "拍摄三张照片").click();
  for (const slot of ["正面", "左侧面", "右侧面"]) {
    await expect(screen(page, "相机拍照")).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(0);
    await expect(
      page.locator('.capture-steps [aria-current="step"]'),
    ).toContainText(slot);
    await button(page, `拍摄${slot}照片`).click();
    await expect(page.getByAltText(`${slot}已拍照片`)).toBeVisible();
    await button(page, "重拍").click();
    await expect(button(page, `拍摄${slot}照片`)).toBeVisible();
    await button(page, `拍摄${slot}照片`).click();
    await button(page, "使用这张照片").click();
  }
  await expect(screen(page, "添加三张照片")).toBeVisible();
  for (const slot of ["正面", "左侧面", "右侧面"])
    await expect(page.getByAltText(`${slot}照片`)).toBeVisible();
  await expect(button(page, "下一步")).toBeEnabled();
  await button(page, "下一步").click();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await button(page, "使用这个分身").click();
  await page.clock.fastForward(1100);
  await expect(screen(page, "脸型与推荐")).toBeVisible();
});

test("camera cancellation preserves confirmed photos and supports mixed sources", async ({
  page,
}) => {
  await startTemplateSetup(page);

  await button(page, "拍摄三张照片").click();
  await button(page, "拍摄正面照片").click();
  await button(page, "使用这张照片").click();
  await button(page, "拍摄左侧面照片").click();
  await button(page, "返回").click();
  await expect(page.getByAltText("正面照片")).toBeVisible();
  await expect(page.getByAltText("左侧面照片")).toHaveCount(0);
  await expect(button(page, "下一步")).toBeDisabled();
  await addPhoto(page, "左侧面", "示例照片 2");
  await addPhoto(page, "右侧面", "示例照片 3");
  await expect(page.getByAltText("左侧面照片")).toHaveAttribute(
    "src",
    /theo.webp$/,
  );
  await expect(button(page, "下一步")).toBeEnabled();
  await button(page, "更换左侧面照片").click();
  await expect(page.getByRole("dialog", { name: "从相册选择" })).toBeVisible();
  await expect(button(page, "相机拍照")).toHaveCount(0);
  await button(page, "关闭").click();
  await expect(page.getByAltText("左侧面照片")).toHaveAttribute(
    "src",
    /theo.webp$/,
  );
});

test("camera and visible entry fit mobile screens", async ({ page }) => {
  await startTemplateSetup(page);

  for (const width of [375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(button(page, "拍摄三张照片")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/photo-entry-${width}.png`,
      fullPage: true,
    });
    await button(page, "拍摄三张照片").click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/camera-${width}.png`,
      fullPage: true,
    });
    await button(page, "返回").click();
  }
});

for (const [width, height] of [[1280, 620], [900, 900], [375, 667]]) {
  test(`phone boundaries and pinned navigation ${width}x${height}`, async ({page}) => {
    await page.setViewportSize({width, height});
    await setup(page);
    const bounds = () => page.locator('.app-shell').boundingBox();
    const shell = (await bounds())!;
    expect(shell.y).toBeGreaterThanOrEqual(0);
    expect(shell.y + shell.height).toBeLessThanOrEqual(height);
    expect(shell.height).toBeLessThanOrEqual(844);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(height);
    const nav = (await page.getByRole('navigation').boundingBox())!;
    expect(Math.abs(nav.y + nav.height - shell.y - shell.height)).toBeLessThanOrEqual(1);
    await button(page, '梦幻光影').click();
    await button(page, '返回').click();
    expect(await page.locator('.app-viewport').evaluate(el => el.scrollTop)).toBeGreaterThan(100);
    expect(await page.getByRole('navigation').boundingBox()).toEqual(nav);
    expect(await bounds()).toEqual(shell);
    await tab(page, '我的分身').click();
    expect(await bounds()).toEqual(shell);
    await button(page, '新建分身').click();

    const next = (await button(page,'下一步').boundingBox())!;
    expect(next.y + next.height).toBeLessThanOrEqual(shell.y + shell.height);
    await button(page, '拍摄三张照片').click();
    await expect(button(page, '拍摄正面照片')).toBeInViewport();
    expect(await bounds()).toEqual(shell);
    await page.screenshot({path:`test-results/phone-${width}-${height}.png`});
  });
}

test('all core screens expose Chinese content and labels', async ({page}) => {
  const chinese = async () => {
    expect(await page.locator('main').innerText()).not.toMatch(/[A-Za-z]{2,}/);
    const labels = await page.locator('[aria-label],img[alt]').evaluateAll(elements => elements.map(el => el.getAttribute('aria-label') || el.getAttribute('alt')).join(' '));
    expect(labels).not.toMatch(/[A-Za-z]{2,}/);
  };
  await chinese();
  await createAI(page);
  await chinese();
  await finishToExplore(page);
  await chinese();
  await button(page,'蝴蝶层次剪').first().click();
  await chinese();
  await generate(page);
  await chinese();
  await button(page,'保存到作品').click();
  await backExplore(page);
  await tab(page,'作品').click();
  await chinese();
  await button(page,'蝴蝶层次剪, 小月').click();
  await button(page,'删除作品').click();
  await chinese();
});

for (const [section, name] of [['人气发型', '蝴蝶层次剪'], ['流行发色', '樱花粉'], ['艺术照', '梦幻光影']]) {
  test(`browse before setup and resume chosen template: ${name}`, async ({page}) => {
    await expect(button(page, '创建我的分身')).toHaveCount(0);
    await expect(page.locator('.rail-section')).toHaveCount(7);
    await button(page, `查看全部${section}`).click();
    await page.locator('.library-grid').getByRole('button', {name, exact: true}).click();
    await expect(screen(page,'Template Detail')).toBeVisible();
    await expect(screen(page,'添加三张照片')).toHaveCount(0);
    await button(page, '应用').click();
    await expect(screen(page,'添加三张照片')).toContainText(`先创建分身，即可应用「${name}」`);
    // Canceling setup returns to the exact template without generating.
    await button(page,'返回').click();
    await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
    await button(page,'应用').click();
    for (const slot of ['正面','左侧面','右侧面']) await addPhoto(page,slot);
    await button(page,'下一步').click();
    await page.clock.fastForward(500);
    await page.clock.fastForward(1300);
    await button(page,'使用这个分身').click();
    await page.clock.fastForward(1100);
    await button(page,`返回应用「${name}」`).click();
    await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
    await expect(page.getByText('当前分身：小月')).toBeVisible();
    await generate(page);
    await button(page,'返回').click();
    await button(page,'返回').click();
    await expect(screen(page,'Library')).toBeVisible();
    await page.reload();
    await expect(page.locator('.rail-section')).toHaveCount(7);
    await expect(button(page,'创建我的分身')).toHaveCount(0);
  });
}

test('creations use one list; settings agreements return to preserved creations', async ({page}) => {
  await tab(page,'作品').click();
  await expect(page.locator('.filter-tabs')).toHaveCount(0);
  await expect(page.getByText('还没有作品')).toBeVisible();
  await button(page,'设置').click();
  for (const name of ['隐私协议','用户协议']) {
    await button(page,name).click();
    await expect(screen(page,name)).toBeVisible();
    await expect(page.getByRole('navigation')).toHaveCount(0);
    await expect(page.locator('.agreement-copy section')).toHaveCount(5);
    await button(page,'返回').click();
    await expect(screen(page,'设置')).toBeVisible();
  }
  await button(page,'返回').click();
  await expect(screen(page,'作品')).toBeVisible();
  await tab(page,'发现').click();
  await setup(page);
  for (const name of ['蝴蝶层次剪','樱花粉','梦幻光影']) {
    await button(page,name).first().click();
    await generate(page);
    await button(page,'保存到作品').click();
    await backExplore(page);
  }
  await tab(page,'作品').click();
  await expect(page.locator('.creation-grid button')).toHaveCount(3);
  await button(page,'设置').click();
  await button(page,'隐私协议').click();
  await button(page,'返回').click();
  await button(page,'返回').click();
  await expect(page.locator('.creation-grid button')).toHaveCount(3);
});

for (const [width, height] of [[458,762],[390,844]]) {
  test(`discovery uses 3:4 portraits with three-plus cards ${width}`, async ({page}) => {
    await page.setViewportSize({width,height});
    await expect(page.locator('.explore .section-head span')).toHaveCount(0);
    await expect(page.locator('.look-card .image-wrap i')).toHaveCount(0);
    const firstRail = page.locator('.explore .look-rail').first();
    const cards = firstRail.locator('.look-card');
    const rail = (await firstRail.boundingBox())!;
    const third = (await cards.nth(2).boundingBox())!;
    const fourth = (await cards.nth(3).boundingBox())!;
    expect(third.x + third.width).toBeLessThan(rail.x + rail.width);
    expect(fourth.x).toBeLessThan(rail.x + rail.width);
    expect(fourth.x + fourth.width).toBeGreaterThan(rail.x + rail.width);
    const image = (await cards.first().locator('.image-wrap').boundingBox())!;
    expect(image.width / image.height).toBeCloseTo(3 / 4, 2);
    const banner = (await page.locator('.discovery-banner').boundingBox())!;
    const shell = (await page.locator('.app-shell').boundingBox())!;
    expect(Math.abs(banner.x - shell.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(banner.y - shell.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(banner.width - shell.width)).toBeLessThanOrEqual(2);
    await page.screenshot({path:`test-results/compact-discovery-${width}.png`});
    await tab(page,'作品').click();
    await page.screenshot({path:`test-results/simple-creations-${width}.png`});
    await button(page,'设置').click();
    await page.screenshot({path:`test-results/settings-${width}.png`});
  });
}

test('optional create-model banner creates and returns to discovery', async ({page}) => {
  await expect(page.locator('.rail-section')).toHaveCount(7);
  await button(page,'创建我的模特').click();
  await expect(screen(page,'添加三张照片')).toBeVisible();
  await button(page,'返回').click();
  await expect(page.locator('.rail-section')).toHaveCount(7);
  await createAI(page,'创建我的模特');
  await button(page,'去发现新造型').click();
  await expect(button(page,'切换分身，当前小月')).toBeVisible();
  await expect(button(page,'创建我的模特')).toBeVisible();
  await tab(page,'作品').click();
  await expect(page.getByText('收藏每一个心动造型')).toHaveCount(0);
  await expect(button(page,'设置')).toBeVisible();
});

test('My AI merges introduction and enters photos with one create click', async ({page}) => {
  await tab(page,'我的分身').click();
  for (const angle of ['正面','左侧面','右侧面']) await expect(page.locator('.angle-guide').getByText(angle,{exact:true})).toBeVisible();
  await button(page,'创建我的分身').click();
  await expect(screen(page,'添加三张照片')).toBeVisible();
  await expect(button(page,'开始创建')).toHaveCount(0);
  await expect(button(page,'拍摄三张照片')).toBeVisible();
  await button(page,'返回').click();
  await expect(screen(page,'我的分身')).toBeVisible();
  await createAI(page,'创建我的分身');
  await button(page,'返回我的分身').click();
  await expect(page.getByRole('heading',{name:'小月',exact:true})).toBeVisible();
});
