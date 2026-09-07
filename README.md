# AI Hair

移动端可交互原型：浏览发型和发色、添加示例照片、试戴并保存结果，也可以通过脸型分析发现适合的发型。

**[打开在线原型](https://luxiaoxia777.github.io/aihair/)** · **[浏览器中编辑源码](https://github.dev/LuXiaoXia777/aihair)**

在线原型由 GitHub Pages 公开部署，无需登录即可体验。编辑器用于修改代码，实时运行请使用本地开发环境；提交到 main 后会自动更新在线原型。

## 体验方式

1. 在 Explore 选择喜欢的发型或发色，点击 Try。
2. 在 Add Your Photo 页面点击 Add Photo，从本地示例相册选择一张照片。
3. 点击 Continue 查看模拟结果；View Original 按钮查看原图，View Result 返回结果。
4. 点击 Save，将这次生成保存到 Me。相同 Look 的不同生成可分别保存。

所有 AI、Camera 和照片来源都是本地 Mock。Download 只演示反馈，刷新会清空照片与作品，没有账号或云端存储。

## 修改原型

- 有写入权限的协作者可以点击上方「浏览器中编辑源码」，修改并提交。
- 其他人可以 Fork 仓库，在自己的副本中修改，再通过 Pull Request 提议合并。
- 修改页面：`src/screens/`；修改通用组件：`src/components/`；修改流程：`src/state/`；修改发型、发色与分类：`src/data.ts`。
- 图片位于 `public/assets/`，请保持 Look ID、文件名与推荐映射一致。
- 开发前先阅读 [CODEX_CONTEXT.md](./CODEX_CONTEXT.md)，重要功能和交互变化需同步更新。

## 本地运行

使用 Node.js 22.12+ 和 npm：

```sh
npm ci
npm run dev
```

打开终端显示的本地地址（默认 `http://localhost:5173/`）。

```sh
npm run build
npm test
```

本机测试默认使用已安装的 Google Chrome。CI 使用 Playwright Chromium：

```sh
npx playwright install chromium
CI=1 npm test
```

## GitHub Pages

仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
`.github/workflows/pages.yml` 在 main 更新后运行回归测试，以 `/aihair/` 为基础路径构建并部署。
失败时检查 Actions 中的 Publish prototype 运行记录，修复后再提交。

技术栈：Vite、React、TypeScript、CSS、Lucide。保留 Screen 栈导航，未引入路由框架。
