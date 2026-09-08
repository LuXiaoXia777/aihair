# AI Hair 项目交接上下文

> 当前产品版本：2026-09-08 中文手机原型。第 15 节为最新最高优先级：先浏览模板，进入详情点击「应用」后才引导创建分身。
> 最新优先约束：全中文交互、固定手机高度、内部滚动、底部 Tab 固定在手机容器底部。下文英文流程名仅用于对照原始规格，不代表界面文案。第 14 节优先于旧版英文 UI 约定。
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

首次：发现页模板列表 → 模板详情 → 应用 → 无分身时创建 → 三角度照片 → 校验 → 创建身份 → 使用分身 → 自动脸型分析 → 返回原模板继续应用。我的分身页主动创建仍返回来源一级页。

以后：Explore / 推荐 → 模板 Detail → Generate（使用当前 AI）→ Result → Save / Regenerate。

产品核心资产是 AIProfile。发型、发色、艺术照是三个独立生成任务，不提供组合编辑。

全部为本地 Mock：不调用 AI、Camera、Photo 或 Backend API。照片、分身、作品存在 React 内存中，刷新清空；Download 仅 Toast。生成图使用模板本地效果图，不是保持真实身份的合成，不得宣传为真实 AI 输出。

不做登录注册、会员、订阅、Credits、社区、评论、分享、编辑器、涂抹、Prompt、视频、Dance、Makeup、评分或复杂脸部分析。

## 3. 三个底部 Tab

仅有 Explore / My AI / Creations，全部可点击，有明确 active 和 aria-current 状态。

- 发现：始终展示全部模板；没有分身也可浏览列表、分类与详情，仅点击详情的「应用」时才引导创建。禁止恢复首屏创建 Gate。
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

详情按钮统一为「应用」。点击时检查 currentAIProfile；缺失则进入创建流程并保留原模板和上游列表栈，存在时直接生成，绝不重复要求上传。

## 5. 创建 AI 流程与回流

1. Create Your AI：说明和 Front / Left / Right 指引，Start。
2. 添加三张照片：点击任何添加或更换照片位，直接打开相册；不再提供照片来源选择弹层。
3. Add 3 Photos 顶部直接显示 Take Photos，依次引导 Front / Left / Right 拍照。每一步有取景预览、角度文案、Take Photo、Retake、Use Photo。确认一张才写入对应槽位，取消保留此前已确认照片。
4. 拍照仅从「拍摄三张照片」进入，依次完成正面、左侧面、右侧面。单个照片位只能从相册选择。相册保留六张人物与模糊照片校验样例；拍照继续使用模拟素材，不请求摄像头权限。
5. 三张完整时 Continue Enabled；缺任一张 Disabled。校验 450ms，期间防止重复操作。
6. 低质量样例按上传位显示 `This photo may not work well. Please replace it.`。仅替换对应位，其他照片保留。
7. 合格后 Creating your AI...，约 1.25 秒；依次显示 Analyzing photos / Creating identity / Preparing your model。
8. AI Profile Created：Your AI is ready!、自动分配名称、Use This AI、Create Another。
9. Use This AI 设置为 currentAIProfile，自动进入约 1 秒脸型分析，不要求再次上传或主动 Analyze Face。
10. Face Shape Result 显示分身图、脸型与 4–5 个推荐。Explore 来源显示 Explore Looks；My AI 来源显示 Go to My AI。点击完成按钮或 Back 回到正确一级页，详情 Back 返回该结果。

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

## 13. 2026-09-08 拍照入口修正

用户指出三图页面只看到上传。最新决定：拍照必须在该页直接可见，不能仅藏在来源 Sheet 中；Camera 不再一点击就自动填图。新增 CapturePhoto 页面和 camera 栈状态，支持三角度连续拍摄、单角度补拍、重拍、确认与取消。上传和拍摄可以混用。模拟取景素材不是实时摄像头画面。增加连续拍摄、混合来源/取消、三个移动宽度的回归测试。


## 14. 2026-09-08 中文与手机容器修正（最新）

- 用户明确要求整个交互使用中文；覆盖导航、标题、按钮、弹层、照片角度、提示、无障碍名称、发型/发色/艺术照名称、分类、介绍与脸型说明。品牌展示为「发型灵感」，分身示例名称使用小月、小夏等。英文代码标识不作为界面文案。
- 三个一级页导航名称为「发现 / 我的分身 / 作品」。仍只在一级页出现，不新增产品功能或恢复已删除方案。
- 桌面手机宽最大 430px，高度为 min(844px, 浏览器可视高度 - 32px)，四周留白并完整显示圆角边界；移动端宽不超过 430px 时占满可视区。页面不得撑高整个网页。
- app-viewport 为唯一正文纵向滚动区。底部导航为容器内独立区域，不遮住正文；弹层、提示和照片页操作栏也限制在手机内部。返回上游页面恢复该栈条目的滚动位置。
- 创建页压缩大标题和装饰留白，突出「拍摄三张照片」与三个独立照片位；小高度下正文可滚动，下一步固定在手机底部。拍照仍是模拟取景，并用中文明示。
- 发型详情提供各自的轮廓、层次和造型特点；脸型说明提供对应推荐理由，不使用通用占位英文。作品筛选无结果与全部无作品区分提示。
- 中文字体采用系统中文字体，移除外部 Google Fonts 请求；补充键盘焦点样式与减少动态效果设置。
- 本次回归覆盖既有 24 项流程，另增加多种窗口高度、手机边界、Tab 固定、返回滚动位置与全中文主流程检查。以最新本地和 GitHub Actions 结果为发布依据。

## 15. 发现页先浏览、应用时创建（最新最高优先级）

用户纠正：没有分身时必须先看到模板列表，点击模板进入详情，再点击「应用」才引导创建，不能一进入发现页就创建。此决定替代原始 MVP 和本文前面所有首次发现页 Gate 规则。

- 发现页取消 ProfileGate，七个模板分区、查看全部、分类和详情对所有用户开放，刷新后也保持展示。
- 所有模板详情按钮统一为「应用」；无分身进入创建引导，有分身直接生成。
- 创建引导展示所选模板名；保留原列表、分类、模板详情的导航栈。
- 照片、创建、分析沿用已确认流程。脸型结果完成按钮返回原模板，用户继续应用；不自动回首页而丢失选择。
- 创建中取消回原详情；再创建一个仍保留模板来源；完成后详情可返回原列表。我的分身页仍可主动创建，完成后返回我的分身。
- 否决：无分身时隐藏发现页模板、首屏强制创建、刷新后只能看创建入口。
- 回归新增发型、发色、艺术照三种入口的浏览、应用、创建、取消、恢复原模板、生成、刷新后列表可见检查。


## 16. 照片入口简化（最新最高优先级）

- 用户明确：添加照片直接从相册选择，不能再出现拍照选项；拍照只用于三个角度的连续拍摄。
- 添加和更换任一照片位直接打开相册。关闭、按 Escape 或点击背景返回三图页，原有照片保持不变，不回到来源选择弹层。
- 删除 PhotoActionSheet、photo-action 状态、相机 single 模式和相关废弃样式，禁止恢复单个照片位拍照入口。
- 「拍摄三张照片」继续从正面开始，依次左侧面、右侧面，各步支持重拍和确认；中途取消保留已确认照片，未填照片仍可从相册补齐。
- 第 13 节记录的单角度补拍及来源 Sheet 方案已被本节否决。
