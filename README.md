# AI Hair · AI Profile MVP

**[打开公开原型](https://luxiaoxia777.github.io/aihair/)** · **[在线编辑源码](https://github.dev/LuXiaoXia777/aihair)**

一个移动端 AI Photo 交互原型。先创建属于你的 AI 身份，再尝试发型、发色和艺术照。

## 完整体验

1. 发现页浏览模板 → 详情 → 应用；没有分身时弹窗选择「相机」或「照片」。也可从首页 Banner 或我的分身主动创建。
2. 相机按正脸、左侧脸、右侧脸依次模拟拍摄，取景画面下方实时显示三张缩略图，拍齐后在原拍照页点击「确定」生成；不再跳转完成页。
3. 照片进入上传页，通过大按钮打开本地相册多选，至少 3 张不同照片可生成，支持追加和删除。
4. 创建完成后使用分身，自动模拟分析脸型并推荐发型；模板来源返回原模板继续应用。
5. 保存结果到作品，支持重新生成、切换分身与作品删除。

三个 Tab：**发现 · 我的分身 · 作品**。作品为统一列表，右上角设置提供隐私协议和用户协议。

本地相册真实读取用户主动选择的文件，仅在当前页面内存预览，不发送服务器。拍照、AI 创建、脸型分析和生成是模拟演示；生成结果使用本地模板图，下载仅提示，刷新清空数据。

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

### 中文手机原型

全中文界面，桌面手机高度最多 844px 且不超过浏览器可视高度；正文内部滚动，底部导航固定在手机内部。发现页顶部 Banner 铺满，模板为 3:4 竖图，每行三个完整卡片并露出第四个。始终允许先浏览模板，仅在应用时检查分身。
