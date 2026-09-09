import { test, expect, type Page } from "@playwright/test";
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
const screen = (page: Page, name: string) =>
  page.locator(`[data-screen-label="${name}"]`);
const tab = (page: Page, name: string) =>
  page.getByRole("navigation").getByRole("button", { name, exact: true });
const selectedProfile = (page: Page, name: string) =>
  page.locator('.profile-choice[aria-pressed="true"]').getByText(name, { exact: true });
const files = ["maya", "theo", "lina", "noah"].map(name => `public/assets/photos/${name}.webp`);
async function uploadThree(page: Page) {
  await page.getByRole("button", {name: /^照片 /}).click();
  await page.getByLabel("本地相册").setInputFiles(files.slice(0, 3));
  await expect(button(page, "生成我的模特")).toBeEnabled();
}
async function startTemplateSetup(page: Page) {
  await button(page, "蝴蝶层次剪").first().click();
  await button(page, "应用").click();
}
async function finishToExplore(page: Page) {
  await tab(page, "发现").click();
}
async function createAI(
  page: Page,
  entry = "创建我的分身",
  photo = "示例照片 1",
) {
  if (entry === "创建我的分身" && !(await screen(page, "我的分身").count())) await startTemplateSetup(page);
  else await button(page, entry).click();

  await uploadThree(page);
  await button(page, "生成我的模特").click();
  await expect(button(page, "正在检查照片…")).toBeVisible();
  await page.clock.fastForward(500);
  await expect(screen(page, "Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await expect(screen(page, "AI Profile Created")).toHaveCount(0);
  await expect(button(page, "使用这个分身")).toHaveCount(0);
  await expect(screen(page, "我的分身")).toBeVisible();
  await expect(tab(page, "我的分身")).toHaveAttribute("aria-current", "page");
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
  await expect(page.getByRole("navigation")).toBeVisible();
  await finishToExplore(page);
  await expect(page.locator(".rail-section")).toHaveCount(7);
  await expect(button(page, "切换分身，当前小月")).toHaveCount(0);
  await expect(tab(page, "发现")).toHaveAttribute("aria-current", "page");
});

test("B: hairstyle generates into works automatically with download and regenerate", async ({
  page,
}) => {
  await setup(page);
  await button(page, "蝴蝶层次剪").first().click();
  await expect(page.getByText("当前分身：小月")).toBeVisible();
  await generate(page);
  await expect(page.locator(".result-image")).toBeVisible();
  const resultImage = (await page.locator(".result-image").boundingBox())!;
  expect(resultImage.width / resultImage.height).toBeCloseTo(3 / 4, 2);
  await expect(
    page.getByRole("button", { name: /View Original|View Result/ }),
  ).toHaveCount(0);
  await expect(page.locator(".compare,.divider,.original-toggle")).toHaveCount(
    0,
  );
  await expect(button(page, "保存到作品")).toHaveCount(0);
  await expect(page.locator(".similar")).toHaveCount(0);
  await button(page, "下载图片").click();
  await expect(page.getByRole("status")).toHaveText("下载演示已完成");
  await button(page, "重新生成").click();
  await expect(screen(page, "Generating")).toBeVisible();
  await page.clock.fastForward(1300);
  await backExplore(page);
  await tab(page, "作品").click();
  await expect(page.locator(".creation-grid button")).toHaveCount(2);
  await expect(page.locator(".creation-grid")).toContainText("小月");
  await expect(page.locator(".creation-grid")).toHaveCSS("column-count", "2");
});

test("C: 我的分身 directly shows face shape and recommendation details return to tab", async ({
  page,
}) => {
  await setup(page);
  await tab(page, "我的分身").click();
  await expect(
    page.getByRole("heading", { name: "椭圆脸", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".ai-profile-hero")).toContainText("脸部比例均衡");
  await expect(page.getByText("当前分身", { exact: true })).toHaveCount(0);
  await expect(page.locator(".my-face-shape")).toHaveCount(0);
  await button(page, "自然微卷").click();
  await button(page, "返回").click();
  await expect(screen(page, "我的分身")).toBeVisible();
  await button(page, "自然微卷").click();
  await generate(page);
  await button(page, "返回").click();
  await button(page, "返回").click();
  await expect(screen(page, "我的分身")).toBeVisible();
});

for (const [name, section, label] of [
  ["樱花粉", "流行发色", "发色"],
  ["梦幻光影", "艺术照", "艺术照"],
] as const) {
  test(`D/E: ${label} detail, automatic works entry and creation 重新生成`, async ({
    page,
  }) => {
    await setup(page);
    await page
      .getByRole("region", { name: section, exact: true })
      .getByRole("button", { name, exact: true })
      .click();
    await generate(page);
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
    page.getByRole("heading", { name: "椭圆脸", exact: true }),
  ).toBeVisible();
  await expect(selectedProfile(page, "小夏")).toBeVisible();
  await expect(button(page, "切换分身")).toHaveCount(0);
  await button(page, "小月").click();
  await expect(page.getByRole("dialog", { name: "分身详情" })).toContainText("创建于");
  await expect(button(page, "设为当前分身")).toBeEnabled();
  await button(page, "设为当前分身").click();
  await expect(selectedProfile(page, "小月")).toBeVisible();
  await button(page, "小夏").click();
  await button(page, "设为当前分身").click();
  await expect(selectedProfile(page, "小夏")).toBeVisible();
  await tab(page, "发现").click();
  await expect(button(page, "切换分身，当前小夏")).toHaveCount(0);
  await button(page, "蝴蝶层次剪").first().click();
  await expect(page.getByText("当前分身：小夏")).toBeVisible();
  await generate(page);
  await expect(page.getByText("当前分身：小夏")).toBeVisible();
  await backExplore(page);
  await tab(page, "我的分身").click();
  await button(page, "小月").click();
  await button(page, "设为当前分身").click();
  await tab(page, "作品").click();
  await button(page, "蝴蝶层次剪, 小夏").click();
  await expect(page.getByText("小夏", { exact: true })).toBeVisible();
  await button(page, "重新生成").click();
  await expect(page.getByText("当前分身：小月")).toBeVisible();
});

test("我的分身库位于推荐上方，删除当前分身后自动选择剩余分身", async ({ page }) => {
  await setup(page);
  await tab(page, "我的分身").click();
  await createAI(page, "新建分身", "示例照片 2");
  const library = page.locator(".profiles-section");
  const recommendations = page.locator(".profile-recommendations");
  const libraryBox = (await library.boundingBox())!;
  const recommendationsBox = (await recommendations.boundingBox())!;
  expect(libraryBox.y).toBeLessThan(recommendationsBox.y);
  await expect(button(page, "切换分身")).toHaveCount(0);
  await expect(page.getByText("脸型特点", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "我的分身", exact: true })).toHaveCount(0);
  const heroBox = (await page.locator(".ai-profile-hero").boundingBox())!;
  expect(heroBox.width / heroBox.height).toBeCloseTo(1, 2);
  await expect(page.locator(".ai-profile-hero").getByRole("button")).toHaveCount(0);
  await page.screenshot({ path: "test-results/profile-hero-summary.png" });
  await button(page, "小夏").click();
  await expect(page.getByRole("dialog", { name: "分身详情" })).toContainText("创建于");
  await expect(button(page, "当前使用中")).toBeDisabled();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/profile-detail.png" });
  await button(page, "删除分身").click();
  await expect(page.getByRole("dialog")).toContainText("使用该分身创建的作品仍会保留");
  await button(page, "取消").click();
  await expect(selectedProfile(page, "小夏")).toBeVisible();
  await button(page, "小夏").click();
  await button(page, "删除分身").click();
  await button(page, "删除分身").click();
  await expect(page.getByRole("status")).toHaveText("分身已删除");
  await expect(selectedProfile(page, "小月")).toBeVisible();
  await expect(button(page, "小夏")).toHaveCount(0);
  await button(page, "小月").click();
  await button(page, "删除分身").click();
  await button(page, "删除分身").click();
  await expect(button(page, "创建我的分身")).toBeVisible();
});

test("H: 下载图片 feedback, delete cancel, confirm and 作品 back", async ({
  page,
}) => {
  await setup(page);
  await button(page, "蝴蝶层次剪").first().click();
  await generate(page);
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

test("all template cards open the correct detail and result has no recommendations", async ({
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
  await expect(page.locator(".similar")).toHaveCount(0);
  await expect(button(page, "保存到作品")).toHaveCount(0);
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

    await page.getByRole("button", {name: /^相机 /}).click();
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
    await expect(page.getByRole("dialog")).toContainText(`创建后即可应用「${name}」`);
    // Canceling setup returns to the exact template without generating.
    await button(page,'取消').click();
    await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
    await button(page,'应用').click();
    await uploadThree(page);
    await button(page,'生成我的模特').click();
    await page.clock.fastForward(500);
    await page.clock.fastForward(1300);
    await expect(screen(page,'我的分身')).toBeVisible();
    await expect(screen(page,'脸型与推荐')).toHaveCount(0);
    await expect(selectedProfile(page, '小月')).toBeVisible();
    await tab(page,'发现').click();
    await button(page,name).first().click();
    await expect(page.getByText('当前分身：小月')).toBeVisible();
    await generate(page);
    await button(page,'返回').click();
    await button(page,'返回').click();
    await expect(screen(page,'发现')).toBeVisible();
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
  await expect(page.getByRole('dialog')).toBeVisible();
  await button(page,'取消').click();
  await expect(page.locator('.rail-section')).toHaveCount(7);
  await createAI(page,'创建我的模特');
  await expect(screen(page,'我的分身')).toBeVisible();
  await tab(page,'发现').click();
  await expect(button(page,'切换分身，当前小月')).toHaveCount(0);
  await expect(button(page,'创建我的模特')).toBeVisible();
  await tab(page,'作品').click();
  await expect(page.getByText('收藏每一个心动造型')).toHaveCount(0);
  await expect(button(page,'设置')).toBeVisible();
});

test('My AI merges introduction and enters photos with one create click', async ({page}) => {
  await tab(page,'我的分身').click();
  await expect(page.locator('.angle-guide')).toHaveCount(0);
  await button(page,'创建我的分身').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(button(page,'开始创建')).toHaveCount(0);
  await expect(page.getByRole('button', {name: /^相机 /})).toBeVisible();
  await button(page,'取消').click();
  await expect(screen(page,'我的分身')).toBeVisible();
  await createAI(page,'创建我的分身');
  await expect(selectedProfile(page, '小月')).toBeVisible();
});


test("source dialog can cancel; native album supports minimum, append, remove and invalid files", async ({page}) => {
  await startTemplateSetup(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(screen(page,"Template Detail")).toBeVisible();
  await button(page,"应用").click();
  await page.getByRole("button", {name: /^照片 /}).click();
  await expect(screen(page,"照片上传")).toBeVisible();
  await expect(button(page,"生成我的模特")).toBeDisabled();
  const chooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", {name: /^打开本地相册/}).click();
  const chooser = await chooserPromise;
  expect(chooser.isMultiple()).toBe(true);
  await chooser.setFiles(files.slice(0,2));
  await expect(page.getByRole("status")).toContainText("已选择 2 张");
  await expect(button(page,"生成我的模特")).toBeDisabled();
  await page.getByLabel("本地相册").setInputFiles(files.slice(0,3));
  await expect(page.getByRole("status")).toContainText("已选择 3 张");
  await expect(button(page,"生成我的模特")).toBeEnabled();
  await page.getByLabel("本地相册").setInputFiles(files.slice(3));
  await expect(page.getByRole("status")).toContainText("已选择 4 张");
  await page.getByLabel("本地相册").setInputFiles({name:"bad.png",mimeType:"image/png",buffer:Buffer.from("invalid")});
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator(".uploaded-grid img")).toHaveCount(4);
  await button(page,"移除照片 4").click();
  await button(page,"移除照片 3").click();
  await expect(button(page,"生成我的模特")).toBeDisabled();
  await page.getByLabel("本地相册").setInputFiles(files.slice(2));
  await expect(button(page,"生成我的模特")).toBeEnabled();
  await page.screenshot({path:"test-results/native-upload.png"});
  await button(page,"生成我的模特").click();
  await button(page,"返回").click();
  await page.clock.fastForward(2500);
  await expect(screen(page,"照片上传")).toBeVisible();
  await expect(page.locator(".uploaded-grid img")).toHaveCount(4);
  await button(page,"生成我的模特").click();
  await page.clock.fastForward(500);
  await expect(screen(page,"Creating AI")).toBeVisible();
  await button(page,"返回").click();
  await page.clock.fastForward(2500);
  await expect(screen(page,"照片上传")).toBeVisible();
});

test("camera captures three guided angles then confirms once to generate", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await button(page,"创建我的模特").click();
  await page.clock.fastForward(400);
  await page.screenshot({path:"test-results/source-dialog.png"});
  await page.getByRole("button", {name: /^相机 /}).click();
  for (const slot of ["正面", "左侧面", "右侧面"]) {
    await expect(screen(page,"相机拍照")).toBeVisible();
    await expect(page.locator('.capture-steps [aria-current="step"]')).toContainText(slot);
    await expect(page.locator('.capture-guide')).toBeVisible();
    await expect(page.locator('.face-axis')).toHaveCount(2);
    await expect(button(page,"重拍")).toHaveCount(0);
    await expect(button(page,"使用这张照片")).toHaveCount(0);
    await expect(button(page,"确定")).toHaveCount(0);
    await expect(page.locator(".capture-thumb")).toHaveCount(3);
    await button(page,`拍摄${slot}照片`).click();
    await expect(page.locator(".capture-thumb img")).toHaveCount(["正面", "左侧面", "右侧面"].indexOf(slot) + 1);
  }
  await expect(screen(page,"拍摄完成")).toHaveCount(0);
  await expect(screen(page,"相机拍照")).toBeVisible();
  await expect(page.locator('.capture-thumb img')).toHaveCount(3);
  await expect(page.locator('.capture-step.filled:not(.active) img')).toHaveCount(3);
  await page.locator('.capture-step').first().click();
  await expect(page.locator('.capture-step').first()).toHaveAttribute('aria-pressed','true');
  await expect(button(page,'重拍')).toBeVisible();
  await button(page,'重拍').click();
  await expect(button(page,'重新拍摄正面照片')).toBeVisible();
  await expect(page.locator('.capture-guide')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('正在重拍正面');
  await page.screenshot({path:"test-results/camera-retake.png"});
  await button(page,'重新拍摄正面照片').click();
  await expect(page.locator('.capture-step').first()).toHaveAttribute('aria-pressed','true');
  await expect(button(page,'完成')).toBeVisible();
  await page.screenshot({path:"test-results/camera-complete.png"});
  for (const [width, height] of [[375,667],[1280,620],[390,844]]) {
    await page.setViewportSize({width,height});
    await expect(button(page,"完成")).toBeInViewport();
    await expect(page.locator(".capture-thumb").last()).toBeInViewport();
    expect(await page.locator(".app-viewport").evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
  }
  await button(page,"完成").click();
  await button(page,"返回").click();
  await page.clock.fastForward(2000);
  await expect(screen(page,"相机拍照")).toBeVisible();
  await expect(page.locator(".capture-thumb img")).toHaveCount(3);
  await button(page,"完成").click();
  await page.clock.fastForward(500);
  await expect(screen(page,"Creating AI")).toBeVisible();
  await page.clock.fastForward(1300);
  await expect(screen(page,"我的分身")).toBeVisible();
  await expect(screen(page,"脸型与推荐")).toHaveCount(0);
  await tab(page,"发现").click();
  await expect(page.locator('.rail-section')).toHaveCount(7);
});
