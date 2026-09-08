# AI Hair 项目交接上下文

> 当前产品版本：2026-09-08 AI Profile MVP。
> 本文件与 `docs/MVP_SPEC_2026-09-08.md` 为最新约束。此前的两 Tab、单照片 Try-On 和原图查看逻辑已经被最新用户要求替换，不得恢复。

## 1. 项目与运行

- 当前项目位于 `/Users/summer/Downloads/ai-hair-project-folder`。
- Vite + React + TypeScript + CSS + Lucide；保留 `Screen[]` 导航栈，不使用 Router。
- 本目录是独立 Git 仓库；origin：`https://github.com/LuXiaoXia777/aihair.git`，发布分支 main。
- 公开网站：`https://luxiaoxia777.github.io/aihair/`。
- `npm ci` / `npm install` 安装；`npm run dev` 运行；默认 `http://localhost:5173/`。
- `npm run build` 构建；`npm test` 运行 Playwright。
- GitHub Pages：`npm run build -- --base=/aihair/`，图片与 favicon 使用 BASE_URL。
- GitHub Actions 在 main 更新后自动测试、构建、公开发布。

## 2. 产品核心与边界

首次：Create AI → Front / Left / Right 三张照片 → 校验 → 创建身份 → Use This AI → 自动脸型分析 → 脸型结果和推荐 → 返回来源一级页。

以后：Explore / 推荐 → 模板 Detail → Generate（使用当前 AI）→ Result → Save / Regenerate。

产品核心资产是 AIProfile。发型、发色、艺术照是三个独立生成任务，不提供组合编辑。

全部为本地 Mock：不调用 AI、Camera、Photo 或 Backend API。照片、分身、作品存在 React 内存中，刷新清空；Download 仅 Toast。生成图使用模板本地效果图，不是保持真实身份的合成，不得宣传为真实 AI 输出。

不做登录注册、会员、订阅、Credits、社区、评论、分享、编辑器、涂抹、Prompt、视频、Dance、Makeup、评分或复杂脸部分析。

## 3. 三个底部 Tab

仅有 Explore / My AI / Creations，全部可点击，有明确 active 和 aria-current 状态。

- Explore：我想变成什么样。无 currentAIProfile 时只展示 Create Your AI 引导，不展示模板。
- My AI：当前身份、切换/新建分身、脸型与推荐。
- Creations：已保存结果与类型筛选。

底部导航只在这三个一级页出现；所有详情、创建、上传、分析、生成、结果、作品详情通过 Back 返回。

## 4. Explore 与模板

首页标题 AI Hair / Find your next look.，右侧当前分身头像和名字。点击打开 Choose Your AI。

内容顺序：Trending Now / Glam Waves / Sleek & Straight / Face-Framing / Chic Short Hair / Trending Hair Colors / AI Portraits。

每个 See All 进入对应 Library，每张卡片进入共用 Detail；Library 是两列图片 Grid，分类切换真实内容，分类保存在栈条目中，返回时保留。

- 发型分类：Trending、Glam Waves、Sleek & Straight、Face-Framing、Chic Short、Bold & Trendy。
- 发色分类：Trending、Natural、Blonde、Red、Fantasy；必须真人染发效果图，禁止色块主卡。
- 艺术照初版：Classic、Dreamy、Vintage、Editorial，Library 具有 All 和对应风格筛选；不提供上传参考照入口。
- 为最新推荐映射增加 Long Layers / Chin-Length Bob。对应本地素材复用 layered-straight / classic-bob，没有删除原 Look ID。

Detail：大图、名称、轻量标签、简短描述、Using 分身名与头像、Generate、同类型 Similar。

Generate 必须检查 currentAIProfile；缺失则进入创建流程。存在时直接生成，绝不出现上传来源选择。

## 5. 创建 AI 流程与回流

1. Create Your AI：说明和 Front / Left / Right 指引，Start。
2. Add 3 Photos：三个独立上传位；每个位打开 Add Photo 二级 Action Sheet（Photo Library / Camera / Cancel）。
3. Photo Library：原项目六张本地 Mock 人物照；额外提供 Blurry photo 低质量示例，以便真实点击体验失败/替换流程。Camera 选择 Front 的合格人物素材，没有 Front 时使用 Photo 3。
4. 三张完整时 Continue Enabled；缺任一张 Disabled。校验 450ms，期间防止重复操作。
5. 低质量样例按上传位显示 `This photo may not work well. Please replace it.`。仅替换对应位，其他照片保留。
6. 合格后 Creating your AI...，约 1.25 秒；依次显示 Analyzing photos / Creating identity / Preparing your model。
7. AI Profile Created：Your AI is ready!、自动分配名称、Use This AI、Create Another。
8. Use This AI 设置为 currentAIProfile，自动进入约 1 秒脸型分析，不要求再次上传或主动 Analyze Face。
9. Face Shape Result 显示分身图、脸型与 4–5 个推荐。Explore 来源显示 Explore Looks；My AI 来源显示 Go to My AI。点击完成按钮或 Back 回到正确一级页，详情 Back 返回该结果。

**回流解释：** 为保留最新需求明确要求的 Face Shape Result 可阅读与可点击推荐页，不用计时器自动跳过它。结果页完成按钮负责最后一步回到来源；整个流程无需用户再选择目的地。

Create Another 保留已创建分身，启动全新三图草稿，并清除上一轮创建栈，避免 Back 进入重复引导页；尚未使用的分身第一次被选中时自动完成脸型分析。没有当前分身但已有创建记录时，引导页允许 Choose Your AI。

## 6. My AI 与切换

My AI 无分身时展示 Create Your AI。已创建时显示：大头像、名称、Switch AI、Face Shape、简短描述、Recommended for You、See All、My AI Profiles、New AI。

Choose Your AI Sheet 列出全部分身与当前勾选，并有 Create New AI。点击分身同步 currentAIProfile；My AI 脸型/推荐、Explore 顶部和后续 Generate 都跟随更新。

新建来源记录 returnTo；从 My AI 创建并使用后，新分身成为当前身份，最终留在 My AI。

## 7. 脸型 Mock 映射

Front 的本地素材决定脸型：maya→Oval、theo→Round、lina→Heart、noah→Square、ava→Diamond、zayn→Oblong。

- Oval：Butterfly Cut / French Bob / Soft Waves / Long Layers / Curtain Bangs。
- Round：Face-Framing Layers / Butterfly Cut / Long Layers / Curtain Bangs / Soft Waves。
- Square：Soft Waves / Curtain Bangs / Long Layers / Romantic Waves。
- Heart：French Bob / Curtain Bangs / Soft Waves / Chin-Length Bob。
- Diamond：Soft Waves / Chin-Length Bob / Curtain Bangs / Long Layers。
- Oblong：Hollywood Waves / Curtain Bangs / French Bob / Voluminous Curls。

所有推荐都引用 data.ts 中实际存在的发型 ID。脸型是分身属性，不是单独历史报告或 Creations 作品。

## 8. 生成与结果

Generating：模板模糊背景、Loading、Creating your new look...、Using 分身名；1.25 秒后进入 Result。Back 取消任务并返回来源详情。

结果仅显示生成大图、模板名、Using 分身名、Save / Regenerate、More Like This。

**所有对比交互都已删除**：无 Before/After、无分割拖动、无 Original/Result Tab，也没有 View Original 按钮。

Save：按生成实例 ID 去重；Toast `Saved to Creations`；变为 Saved ✓。同模板每次重新生成有独立 ID，可分别保存。

Result Regenerate：当前 AI + 当前模板直接再次生成；替换结果栈层，不堆积旧结果。More Like This 进入同类型 Detail，Back 返回结果。

每个结果保存生成当时的 AI ID、名字、头像与模板信息快照，切换分身不会把旧作品归属改掉。

## 9. Creations

筛选：All / Hairstyles / Hair Colors / Portraits，两列图 Grid，显示模板名和所属 AI。

空状态：No creations yet / Explore a hairstyle, hair color or portrait to create your first look. / Explore。

Creation Detail：图片、模板名、AI 名、类型；Download / Regenerate / Delete。

- Download：Toast `Download started`。
- Regenerate：回对应类型的模板 Detail，显示当前分身，用户再 Generate。
- Delete：确认 Sheet，Cancel 关闭不改数据；确认删除实例后返回 Creations，Toast `Creation deleted`。

## 10. 状态、计时器与代码

- `src/state/types.ts`：RootTab / Screen / AIProfile / Creation / PhotoDraft / MockPhoto / ActiveSheet 等。
- `src/state/useAppState.ts`：Screen 栈、aiProfiles、currentAIProfile、三图草稿、校验、计时器、创建/切换、生成与作品保存。
- `src/state/faceData.ts`：素材、上传位、质量示例、名字、脸型映射及描述。
- `src/data.ts`：三种模板和 Library / Similar 辅助函数。
- `src/App.tsx`：只做页面调度与回调连接。
- `src/screens/CreateAI.tsx`：创建入口、三图页、创建进度、成功、分析与生成状态。
- `src/screens/MyAI.tsx`：分身 Gate 与 My AI。
- `src/screens/FaceResult.tsx`：分身脸型结果与推荐。
- Explore / Library / Detail / Result / Creations / CreationDetail：对应页面。
- `src/components/ui.tsx`：Top / BottomNav / LookCard / UsingAI。
- `src/components/sheets.tsx`：来源、相册、切换和删除；支持 Escape、焦点约束与背景关闭。
- `src/styles.css` + `src/profile.css`：沿用原视觉；移动宽 375 / 390 / 430，桌面最大 430 居中。

异步任务绑定到确切 Screen 对象。任何离页立即取消 timer，useEffect 卸载也清理；完成前核对当前栈顶，防止迟到导航。

## 11. 已删除方案

- 两 Tab Explore / Me，旧 Me 命名。
- 先浏览再逐次上传单照片的 Try This Look / Try This Color 流程。
- PhotoSelection、selectedPhoto、faceAnalysisPhoto、fromAnalysis 分支。
- Explore 主动分析 Banner、Choose a Photo、Analyze Another Photo。
- Compare、ResultPhoto、原图查看按钮与所有对比。
- 旧 Result Try Another Look / Color 和作品详情 Try Again。
- 相关废弃页面和独立样式文件已移除，不保留备用实现。

## 12. 测试与维护

`tests/prototype.spec.ts` 覆盖最新 A–H，以及三图校验替换、全部分类与首页卡片、Similar/More、六脸型、三阶段取消、Create Another、375/390/430 布局和图片加载。

本机 Playwright 使用已安装 Chrome；CI 使用 Chromium。截图/trace 在被 Git 忽略的 test-results。发布前必须运行新测试，不能保留旧原图按钮测试作为验收依据。

后续每次核心交互或产品决定变化都更新本文件。原始最新用户规格保存在 docs/MVP_SPEC_2026-09-08.md。所有新增 UI 都必须有实际行为，不添加当前 MVP 之外的功能。

本次本地验收：21 项主流程与边界回归已验证；另在 `/aihair/` 生产构建路径下通过首次创建、艺术照与 375px 布局/素材的 3 项回归。最终发布仍以 GitHub Actions 的成功状态为准。
