# AI Hair 项目交接上下文

> 本文件面向首次接手项目的 Codex。它记录截至 2026-09-07 的最终产品决定、代码现状、已淘汰方案、验证结果和继续开发时的约束。
>
> 最新产品决策（2026-09-07 本次会话）：结果页完整展示生成图，仅通过 `View Original` / `View Result` 按钮查看原图或返回结果。旧拖拽 Before / After Slider 已删除，不得恢复。
>
> 冲突处理原则：用户越晚提出的要求优先级越高。尤其是照片上传流程，必须以本文“最终上传流程”为准，不能恢复早期 Bottom Sheet 方案。

## 1. 项目位置与启动方式

- 当前项目根目录：项目所在目录（本机为 `/Users/summer/Downloads/ai-hair-project-folder`）
- 技术栈：Vite + React + TypeScript + 普通 CSS + `lucide-react`
- 安装：`npm install`
- 开发：`npm run dev`
- 默认地址：`http://localhost:5173/`
- 构建：`npm run build`
- 当前构建状态：已通过。
- 当前 `5173` 服务应来自本项目。此前该端口曾被旧项目 `/Users/design/Documents/Codex/2026-09-07/gen-j/outputs/ai-hair-mvp-local` 占用，导致浏览器显示低保真旧页面；已关闭旧服务并启动当前项目。再次出现旧 UI 时先用 `lsof -nP -iTCP:5173 -sTCP:LISTEN` 和 `lsof -a -p <PID> -d cwd -Fn` 核对进程目录。

本次已在项目目录建立独立 Git 仓库，origin 为 `https://github.com/LuXiaoXia777/aihair.git`，main 已推送。Git 操作仍需先确认根目录，避免影响其他项目。

## 2. 产品定位与核心目标

AI Hair 是面向海外消费者的移动端 AI Hair Try-On Web Prototype。它不是 Landing Page、静态 UI 展示稿或专业图片编辑器。

核心心智：

`Browse → Choose a Look → Add a Photo → Try It → See Result`

现阶段有三个能力：

1. AI Hairstyle Try-On
2. AI Hair Color Try-On
3. Face Shape Analysis，用于帮助用户找到适合尝试的发型

发型和发色是两个完全独立的生成任务。一次只完成一个任务，不能同时选择发型和发色，也不能在发型生成页修改发色或在发色生成页修改发型。

Face Shape Analysis 不是独立的复杂诊断产品。它只承担“上传正脸照 → 模拟脸型结果 → 推荐发型 → 进入现有发型试戴流程”的发现与导流作用。

所有 AI、相册和摄像头行为均为本地 Mock：不调用真实 AI API、系统相册或相机权限。

## 3. 当前信息架构

底部导航仅有两个 Tab：

- Explore：浏览发型、发色和进入 Face Shape Analysis
- Me：查看已保存的发型/发色生成结果

Bottom Navigation 只显示在 Explore 和 My Creations。以下沉浸式二级页面不显示 Bottom Navigation：

- Hairstyle / Hair Color Library
- Hairstyle / Hair Color Detail
- Photo Selection
- Generating
- Result
- Face Shape Analysis / Analyzing / Result
- Creation Detail

Explore 当前顺序：

1. `AI Hair` / `Find your next look.`
2. `Find Your Face Shape` 轻量 Banner
3. Trending Now
4. Glam Waves
5. Sleek & Straight
6. Face-Framing
7. Chic Short Hair
8. Trending Hair Colors
9. Bottom Navigation：Explore / Me

## 4. 页面清单与职责

### Explore

- 内容浏览首页，不是上传首页。
- 顶部 Face Shape Banner 是轻量入口，整张 Banner 和 `Analyze Now` 均可点击。
- 每个 Look 卡片均可进入相应 Detail。
- 每个 `See all` 可进入对应 Library。
- 禁止添加搜索框、巨型 Hero、编辑器、技术参数分类或首页上传卡片。

### Hairstyle Library

- 标题 `Hairstyles`，两列图片 Grid。
- 分类：Trending、Glam Waves、Sleek & Straight、Face-Framing、Chic Short、Bold & Trendy。
- 分类按用户想要的 Look / 效果组织，不能改回 Short / Medium / Long / Curly。

### Hair Color Library

- 标题 `Hair Colors`，两列真人染发效果 Grid。
- 分类：Trending、Natural、Blonde、Red、Fantasy。
- 发色必须通过真人头发效果图表达，不能以圆形色块作为主卡片。

### Hairstyle Detail

- 大图、名称、轻量标签、短描述、`Try This Look`、Similar Looks。
- Similar Look 点击后复用同一个 Detail 组件切换内容。
- 不提供收藏、发色编辑、参数编辑或复杂工具。

### Hair Color Detail

- 与 Hairstyle Detail 共用 `Detail` 组件。
- CTA 为 `Try This Color`，相似内容为同类型发色。
- 不允许在此修改发型。

### Photo Selection（最终上传流程）

- 统一标题：`Add Your Photo`，不能与 `Choose Your Photo` 混用。
- 这是独立页面，不是 Bottom Sheet。
- 包含：Back、正确正脸示例、三种错误示例、Your Photo 区域、`Add Photo`、固定底部 `Continue`。
- 三种错误示例：Face covered、Side profile、Multiple people。
- 未选择照片时 Continue 为 Disabled；选择后 Enabled。
- 已选照片显示缩略图、强调色边框和 Check，且仅允许选择一张。
- 已存在 `selectedPhoto` 时再次进入必须继续显示，用户可直接 Continue 或替换。

### Add Photo Action Sheet

- 只有在 Photo Selection 页面点击 `Add Photo` 才出现。
- 小型系统感二级 Action Sheet，选项为：Photo Library、Camera、Cancel。
- 这是实现方式选择，不是产品主任务，所以不能升级为页面中的两个巨大主按钮。

### Mock Photo Library

- 复用本地 6 张人物图。
- 点击一张后关闭 Picker，回到 Photo Selection，更新唯一选择并启用 Continue。
- 再选另一张会替换当前照片。

### Face Shape Analysis

- 初始页只解释拍摄要求并提供 `Choose a Photo`。
- 点击后进入统一 Photo Selection 页面，而不是旧上传 Sheet。
- Continue 后在 Face Shape Analysis 页面内进入 Analyzing。
- 支持 Oval、Round、Square、Heart、Diamond、Oblong 六种 Mock 结果。
- 不保存脸型历史，不进入 My Creations。

### Face Shape Result

- 显示用户照片、脸型、简短非医学描述和 Recommended For You。
- 推荐卡片直接进入现有 Hairstyle Detail，禁止复制新详情页。
- `Analyze Another Photo` 进入统一 Photo Selection 页面；已有照片必须显示并允许替换。

### Generating

- 不是真实独立路由，而是原 Detail 组件的生成状态。
- 文案：`Creating your new look...` / `This may take a few seconds.`
- Mock 延迟约 1.25 秒，然后进入 Result。

### Hairstyle / Hair Color Result

- 共用 `Result` 组件。
- 默认完整显示生成图。图片右下角仅有 `View Original` 按钮，点击显示本次生成使用的原图，按钮变为 `View Result`，再次点击返回生成图。
- 没有拖拽分割线、Before / After 标签或 Original / Result Tab。
- 提供 Save、Try Another Look / Color、More Like This。
- 顶部 Download 可点击并显示 `Download started` Toast。
- Save 后加入 My Creations，按钮变为 `Saved ✓`，再次点击不重复保存。

### My Creations

- Me 页唯一职责是查看已保存的生成结果。
- 筛选：All、Hairstyles、Hair Colors。
- 空状态：`No looks yet` 和 `Explore Looks`。
- 不提供登录、资料、会员、积分、购买、通知或设置。

### Creation Detail

- 显示生成图、Look 名称、类型。
- 操作：Download、Try Again、Delete。
- Delete 打开确认 Bottom Sheet；确认后删除、返回 My Creations，并显示 `Creation deleted`。

## 5. 核心用户流程

### 普通发型试戴

`Explore / Hairstyle Library → Hairstyle Detail → Try This Look → Photo Selection → Add Photo → Photo Library 或 Camera → 返回 Photo Selection → Continue → Generating → Hairstyle Result → Save → Me`

### 普通发色试戴

`Explore / Hair Color Library → Hair Color Detail → Try This Color → Photo Selection → Add Photo → Photo Library 或 Camera → 返回 Photo Selection → Continue → Generating → Hair Color Result → Save → Me`

### 脸型分析与推荐试戴

`Explore → Find Your Face Shape → Face Shape Analysis → Choose a Photo → Photo Selection → Add Photo → 选择照片 → Continue → Analyzing → Face Shape Result → 推荐发型 → 现有 Hairstyle Detail → Try This Look → 直接复用 faceAnalysisPhoto → Generating → Result`

关键：最后一步绝不能再次进入 Photo Selection，因为用户已为脸型分析上传过照片。

### 更换脸型分析照片

`Face Shape Result → Analyze Another Photo → Photo Selection（显示已有照片）→ Add Photo → 选择替代照片 → Continue → Analyzing → 新脸型结果和新推荐列表`

### 管理作品

`Me → Creation → Creation Detail → Download / Try Again / Delete → Delete confirmation → My Creations`

## 6. 返回栈规则

项目使用组件状态维护的 `Screen[]` 导航栈，不使用 React Router。

必须成立：

- Explore → Look Detail → Back → Explore
- Library → Look Detail → Back → 原 Library 与原分类
- Hairstyle / Hair Color Detail → Photo Selection → Back → 来源 Detail
- Face Shape Analysis → Photo Selection → Back → Face Shape Analysis
- Face Shape Result → 推荐发型 Detail → Back → 原 Face Shape Result
- My Creations → Creation Detail → Back → My Creations

`Try Another Look / Color` 当前直接回 Explore。Bottom Tab 点击也会重置为对应根页面。

## 7. 最终 UI / UX 规则及原因

- 视觉优先：用户先看到真人 Look，再决定是否 Try。原因是产品核心是消费型图片体验，而不是技术参数配置。
- 使用真人效果卡片：发型和发色都必须让用户预判“上头后的效果”。抽象色块无法传达真实染发效果。
- 轻量分类：分类以 Trend / Glam / Face-Framing 等目标效果命名，避免 Short / Medium / Long / Curly 这类实现或物理参数心智。
- 单任务生成：发型与发色完全分开，避免演变成复杂编辑器。
- 单一主 CTA：Photo Selection 只突出 Continue；页面内只有一个 `Add Photo` 入口。原因是用户任务是添加一张可用照片，不是选择设备来源。
- 系统来源下沉：Photo Library / Camera 只能在二级 Action Sheet 出现，因为它们属于“如何添加”的系统级选择。
- 复用照片：全局 `selectedPhoto` 在刷新前保留；再次进入 Photo Selection 时展示当前照片。脸型推荐试戴直接复用 `faceAnalysisPhoto`，减少重复上传。
- 反馈完整：按钮有 press 缩放/透明度反馈；Tab 有明确 Selected；生成有 Loading；Save 有状态；Download/Delete/Save 有 Toast。
- 移动优先：基准 390×844，同时支持 375、390、430；桌面最大宽约 430px 居中；页面本身就是 App，不画手机壳。
- 二级页面沉浸：底部导航只放根页面，避免 Detail / Result 上出现无关跳转。
- 所有看起来可点击的元素必须有行为；不实现的控件不得画成按钮。

当前视觉语言：暖象牙白底、墨蓝黑主文字和按钮、薰衣草紫作为唯一强调色；大尺寸真人图、圆角但不过度卡片化；英文消费型 App 文案；Lucide 图标；轻微纹理和简短过渡。

## 8. 明确删除或修改过的方案

### 已删除：首页 Upload / Add Your Photo 入口

早期低保真页面曾把 Upload Photo 放在 Explore 顶部，并使用 Short / Medium / Long / Curly 分类以及发色色块。这不是当前项目方案，禁止恢复。

原因：用户必须先浏览并喜欢一个 Look，再进入试戴；发色也必须用真人效果图表达。

### 已删除：Try 后直接弹出的旧 Add Photo Bottom Sheet

旧结构：

```text
Add a photo
Choose from Photos
Take a Photo
Cancel
```

已彻底从代码中移除，禁止恢复或与新流程并存。

原因：旧结构错误地把 Photo Library / Camera 变成产品层的两个巨大主任务。最终设计把产品任务统一为 `Add Photo`，再在二级 Action Sheet 选择 Photo Library / Camera。

### 已修改：Face Shape Analysis 照片入口

早期版本点击 Choose a Photo 会打开与 Try-On 相同的旧 Bottom Sheet。最终版本必须进入独立 Photo Selection，并在 Continue 后开始 Analyzing。

### 已明确不做：复杂 Face Analysis

不得添加颜值评分、五官打分、年龄/性别/皮肤检测、美容建议、妆容推荐、百分比、雷达图或长篇 AI 报告。

原因：Face Shape Analysis 只是把用户导向更合适的发型试戴。

## 9. 永远不能重新出现的旧方案

- Explore 顶部 Upload Photo / Add Your Photo 卡片或按钮
- 旧 Add Photo Bottom Sheet 中两个巨大主按钮 `Choose from Photos` / `Take a Photo`
- Short / Medium / Long / Curly 作为主发型 Library 分类
- 仅以圆形色块展示 Hair Color
- Original / Result Tab、拖拽 Before / After Slider（已被最新用户要求否决，改为原图查看按钮）
- 发型与发色同时编辑
- 发型页修改发色、发色页修改发型
- 专业图片编辑器、Prompt、参数面板、手动涂抹
- Favorite / Heart（未实现收藏系统）
- Create、Profile、Tools、Community 等额外 Bottom Tab
- 登录/注册、Subscription、Credits、Membership、社区、Feed、社交分享、Onboarding、复杂 Settings
- Face Analysis 历史或报告保存到 Me
- 任何无行为的按钮、图标、Tab、Card 或 See All

## 10. 当前已实现功能

- Explore 六个内容 Section 和 Face Shape Banner
- 两个可点击 Bottom Tab 及 Active 状态
- Hairstyle / Hair Color 分类 Library 与内容切换
- 所有 Look 卡片和 See All
- 共用的 Hairstyle / Hair Color Detail
- Similar Looks / Colors 切换
- 独立 Photo Selection 页面和正确 Back 行为
- 正确照片与三种错误照片示例
- Add Photo 二级 Action Sheet
- 本地 6 图 Mock Photo Library
- Camera 默认选择本地 Photo 3，不请求权限
- 单图选择、替换、选中态、Continue Enabled / Disabled
- 已有 `selectedPhoto` 的刷新前复用
- 约 1.25 秒 Mock Generating
- 完整结果图与 View Original / View Result 原图查看按钮
- Result Save、Saved 状态、Try Another、More Like This、Download Toast
- My Creations 本地状态、三种筛选、空状态
- Creation Detail、Try Again、Download、Delete Confirmation
- Face Shape 初始、Analyzing、Result 三态
- 六种脸型 Mock 映射和不同推荐列表
- Analyze Another Photo
- 脸型推荐进入现有 Hairstyle Detail，并在 Try 时直接复用照片
- 统一 Toast：Saved to My Creations、Download started、Creation deleted
- 本地发型、发色和人物图片；没有远程图片接口
- 375 / 390 / 430px 布局无横向页面溢出（内容 Rail 自身允许横向滚动）

## 11. 当前未完成或刻意 Mock 的功能

这些不是遗漏，而是 MVP / 原型边界；除非用户明确扩展范围，不要自行实现：

- 真实 AI 发型、发色生成
- 真实脸型识别
- 真实系统相册或 Camera 权限
- 真正文件下载（目前仅 Toast）
- 数据库、登录、云同步或跨刷新持久化
- 真实生成图片合成；After 使用所选 Look 的本地效果图
- Face Analysis 历史
- 收藏、分享、购买、订阅、积分和社区

## 12. 代码结构与重要组件

- `src/App.tsx`：页面调度，不承载页面内部实现。
- `src/screens/`：Explore、Library、Detail、PhotoSelection、FaceAnalysis、Result、Me、CreationDetail。
- `src/components/ui.tsx`：Top、BottomNav、LookCard、FaceLineArt。
- `src/components/sheets.tsx`：PhotoActionSheet、Picker、DeleteSheet 与共用 Sheet。
- `src/components/ResultPhoto.tsx`：完整结果图与原图查看按钮。旧 Compare 组件已删除。
- `src/state/types.ts`：Screen、Creation、FaceShape、FaceAnalysisStatus、MeFilter。
- `src/state/useAppState.ts`：导航、照片复用、可取消生成/分析、作品实例和 Toast。
- `src/state/faceData.ts`：六张 Mock 照片、脸型映射、描述和推荐。
- `src/data.ts`：Look 数据、分类和 Explore Sections；图片路径使用 Vite BASE_URL。
- `src/styles.css`、`face-analysis.css`、`photo-selection.css`：沿用视觉并格式化为可读代码。
- `public/assets/looks/` 与 `public/assets/photos/`：原项目的本地 WebP 素材，未替换。
- `tests/prototype.spec.ts`、`playwright.config.ts`：可重复运行的浏览器回归测试。
- `.github/workflows/pages.yml`：main 更新后运行测试、构建并发布 GitHub Pages。

## 13. 核心状态与技术决策

### 独立状态模块与 Screen 栈，不使用 Router

`useAppState` 使用 `Screen[]` 作为导航栈，由 `App` 调度：

- `push` 进入下一页
- `replace` 用于 Similar Look 在同层 Detail 内切换
- `back` 弹栈
- `home` 重置到 Explore 或 Me

这样做是为了快速实现可点击原型、准确控制来源返回，并避免引入路由依赖。后续若迁移正式 Router，必须保留相同返回语义。

### Photo Selection 通过来源参数分流

`{kind:'photo-selection', source:'look'|'face', lookId?:string}` 记录来源：

- `look`：Continue 后回到来源 Detail 的 Generating 状态并生成对应 Look
- `face`：Continue 后回到 Face Shape Analysis 的 Analyzing 状态

不要通过文案、当前 URL 或组件类型猜来源。

### 全局照片复用

- `selectedPhoto`：最近一次选择的照片，普通生成和再次进入 Photo Selection 使用
- `faceAnalysisPhoto`：脸型分析实际使用的照片
- 推荐发型的 Detail Screen 带 `fromAnalysis:true`
- 当 `fromAnalysis && faceAnalysisPhoto` 时，Try 直接调用生成，不进入 Photo Selection

这段判断是明确的 UX 要求，不得简化掉。

### Mock 映射

本地照片数组顺序决定脸型：

1. maya → Oval
2. theo → Round
3. lina → Heart
4. noah → Square
5. ava → Diamond
6. zayn → Oblong

`faceRecommendations` 为每种脸型提供不同 Look ID 列表。推荐只能引用 `data.ts` 中真实存在的发型 ID。

### 本地数据生命周期

所有状态仅存在于 React 内存，刷新即清空，符合最初“不需要数据库、刷新前保持即可”的要求。不要误称为持久化。

### 图片策略

真人发型、发色和输入照片由本地 Mock 素材组成，全部在 `public/assets`。不要改成远程图片热链或在线图片 API。发色缩略图必须继续使用真人染发图。

## 14. 验收与运行

- `npm ci` 安装，`npm run dev` 本地预览，`npm run build` 编译。
- 本次 `npm test` 的 14 项浏览器回归全部通过；另在 `/aihair/` 生产构建子路径下通过 2 项图片加载与原图按钮回归。本机默认使用 Chrome，CI 使用 Playwright Chromium。
- 测试覆盖：Library 分类返回、Photo Selection 禁用/启用与替换、结果原图按钮和照片快照、同 Look 多次保存及重复保存去重、作品筛选/删除/取消、发色 Camera、下载 Toast、六种脸型推荐直接复用照片、分析离页取消与重新分析、375/390/430 布局和本地图片加载。
- GitHub Pages 构建命令：`npm run build -- --base=/aihair/`。部署时所有本地图片与 favicon 必须兼容此子路径。
- 旧会话的 Slider 拖拽验收已失效，禁止据此恢复旧交互。

## 15. 当前已知边界

1. 结果依旧是 Mock Look 模特图，不是保持同一人物身份的真实合成。
2. 所有照片、作品和状态仅在内存中保留，刷新清空。
3. Download 仅显示 Toast，Camera 只选择本地 Photo 3，不请求系统权限。
4. 字体仍使用 Google Fonts，网络不可用时回退系统字体。
5. 作品 Grid / Detail 使用 Look 图，符合当前 Mock 边界；输入照片保存在 Creation.photo。

本次已修复：组件集中、any 筛选类型、裸计时器、Look ID 去重、Library 分类返回丢失，以及旧结果依赖全局照片而被后续生成覆盖的问题。

## 16. 下一步优先级 / TODO

1. 维护 GitHub Pages 自动发布，任何核心交互改动必须先运行回归。仓库和公开 Pages 已配置，实际运行状态以 Actions 为准。
2. 持续维护现有回归测试，不重新设计已确认流程。
3. 仅在用户要求更逼真原型时制作同人物配对素材，不接真实 AI API。
4. 仅在用户明确要求时引入跨刷新持久化或离线字体。

## 17. 开发时必须遵守的约束

- 先理解最新需求，再改代码；历史要求与最新要求冲突时以最新为准。
- 只做用户指定范围，不主动增加账户、商业化、社区、编辑器或诊断能力。
- 发型与发色永远是独立任务。
- Face Shape Analysis 永远服务于发型推荐，不变成美容/医学报告。
- 不恢复旧上传 Bottom Sheet；统一走独立 `Add Your Photo` 页面。
- Photo Library / Camera 只能放在 Add Photo 的二级 Action Sheet。
- 保留脸型分析照片到推荐发型 Try-On 的直接复用。
- Photo Selection 必须保留现有照片，并允许替换；Continue 无照片必须 Disabled。
- Hair Color 主视觉必须是真人染发效果图，不能退回色块。
- 不使用远程图片服务、第三方原型平台、iframe 或真实远程 API。
- 所有可见可点击元素必须有真实状态反馈；不实现就不要画成按钮。
- Bottom Navigation 只能有 Explore 和 Me。
- 保持 375 / 390 / 430px 移动适配；桌面最大宽 430px 居中，不画设备壳。
- 修改后至少运行 `npm run build`，并按受影响链路做真实浏览器回归。
- 不要仅因构建通过就宣称交互正确；必须验证导航栈、Disabled/Enabled、状态切换和照片复用。
- 不要随意删除或替换 `public/assets`；Look ID、文件名和推荐映射存在直接引用关系。
- 工作区可能处在用户的大范围 Git 仓库中；任何 Git 操作前先执行 `git rev-parse --show-toplevel`，避免影响无关文件。

## 18. 接手后的最小核对步骤

1. 阅读本文件、`src/App.tsx`、`src/state/useAppState.ts` 和相关 screen/component。
2. `npm ci`，`npm run build`，`npm test`。
3. 复用已运行的开发服务；本机地址 `http://localhost:5173/`。
4. 检查 Git 仓库根目录和远端后再操作；不要提交 node_modules、dist、测试报告或凭据。
5. GitHub 目标仓库为 `https://github.com/LuXiaoXia777/aihair`；Pages 目标为 `https://luxiaoxia777.github.io/aihair/`。发布是否成功必须通过实际部署结果确认，不能只根据目标 URL 判断。

## 19. 本次实现决策（2026-09-07）

- 最新用户要求优先于旧交接文档：删除拖拽前后对比，改用原图查看按钮。
- 每次生成创建独立数字 ID（当前内存生命周期内单调递增），结果 Screen 保存完整 Creation 快照；Save 按实例 ID 去重，同一 Look 可以生成并保存多次。
- 所有导航操作取消正在进行的 Mock timer，卸载时也清理；分析退出不留下迟到结果。
- Library 分类保存在 Screen 栈条目中，返回保留用户实际选中的分类。
- 用户要求将项目导入指定 GitHub 仓库并提供对外公开网站与可修改源码；完整项目已推送，Pages 已配置为公开且强制 HTTPS，main 更新后由 Actions 自动发布。共享贡献通过 Fork / Pull Request，有仓库写权限的人可直接提交，不擅自授予陌生人写权限。

## 20. GitHub 交付

- 仓库：`https://github.com/LuXiaoXia777/aihair`（Public）。
- 公开网站：`https://luxiaoxia777.github.io/aihair/`，访客无需登录。
- 浏览器代码编辑：`https://github.dev/LuXiaoXia777/aihair`；协作者需要写权限，其他人通过 Fork / Pull Request 贡献。
- 仓库 About 已设置网站链接，README 提供预览和编辑入口。
- main 自动运行测试、构建和 Pages 发布；运行记录位于仓库 Actions。
