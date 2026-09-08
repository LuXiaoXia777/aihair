# AI Hair · AI Profile MVP

**[打开公开原型](https://luxiaoxia777.github.io/aihair/)** · **[在线编辑源码](https://github.dev/LuXiaoXia777/aihair)**

一个移动端 AI Photo 交互原型。先创建属于你的 AI 身份，再尝试发型、发色和艺术照。

## 完整体验

1. Explore → Create My AI → Start。
2. 添加 Front / Left / Right 三张示例照片，Continue。
3. 创建完成后 Use This AI，自动分析脸型并推荐发型。
4. Explore Looks 返回首页，选择任意模板，Generate 直接使用当前分身。
5. Save 保存到 Creations，Regenerate 重新生成。
6. My AI → New AI 创建更多分身；Switch AI 或首页头像切换当前身份。

三个 Tab：**Explore · My AI · Creations**。结果仅展示生成图，没有原图或前后对比。

所有 AI、照片校验和 Camera 行为都是本地 Mock，没有真实 AI 或后端 API。相册中的 Blurry photo 可以体验校验失败和替换。生成结果使用本地模板效果图；Download 仅显示反馈；刷新后内存状态清空。

## 运行与测试

使用 Node.js 22.12+：

```sh
npm install
npm run dev
npm run build
npm test
```

默认地址 `http://localhost:5173/`。本机测试使用 Chrome，CI 使用 Playwright Chromium：

```sh
npx playwright install chromium
CI=1 npm test
```

测试覆盖首次创建、三图校验、多分身、全部模板类型、推荐、作品保存/删除、计时器取消与移动适配。

## 继续修改

- 先阅读 [CODEX_CONTEXT.md](./CODEX_CONTEXT.md) 与 [最新 MVP 规格](./docs/MVP_SPEC_2026-09-08.md)。
- 页面：`src/screens/`；状态：`src/state/`；组件：`src/components/`；模板：`src/data.ts`。
- [艺术照素材与生成说明](./docs/ASSETS.md)。本地图片都在 `public/assets/`。
- 有写权限的协作者可在线编辑并提交；其他人 Fork 后通过 Pull Request 贡献。
- main 更新后 GitHub Actions 自动测试、构建并发布公开网站。
- GitHub Pages 构建使用 `/aihair/` 基础路径；Settings → Pages → Source 保持 GitHub Actions。
