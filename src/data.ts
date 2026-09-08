export type LookType = "hairstyle" | "color" | "portrait";
export type Look = {
  id: string;
  name: string;
  type: LookType;
  image: string;
  tags: string[];
  description: string;
  categories: string[];
};
const img = (id: string) =>
  `${import.meta.env.BASE_URL}assets/looks/${id}.webp`;
const hair = (
  id: string,
  name: string,
  categories: string[],
  tags = ["精致", "简约", "日常"],
): Look => ({
  id,
  name,
  type: "hairstyle",
  image: img(id),
  tags,
  description: `${name}：轻盈的发丝走向与自然层次，让日常造型更有变化。`,
  categories,
});
const color = (
  id: string,
  name: string,
  categories: string[],
  tags = ["清新", "个性", "光泽感"],
): Look => ({
  id,
  name,
  type: "color",
  image: img(id),
  tags,
  description: `${name}：用富有层次的色泽改变整体氛围，看看这款发色带来的新感觉。`,
  categories,
});
export const looks: Look[] = [
  hair(
    "butterfly-cut",
    "蝴蝶层次剪",
    ["热门", "修饰脸型"],
    ["层次感", "修饰脸型", "流行"],
  ),
  hair("french-bob", "法式波波头", ["热门", "利落短发"]),
  hair("wolf-cut", "狼尾剪", ["热门", "个性潮流"]),
  hair("soft-layers", "轻盈层次剪", ["热门", "修饰脸型"]),
  hair("hollywood-waves", "复古大波浪", ["蓬松卷发"]),
  hair("soft-waves", "自然微卷", ["蓬松卷发"]),
  hair("romantic-waves", "浪漫波浪卷", ["蓬松卷发"]),
  hair("voluminous-curls", "丰盈卷发", ["蓬松卷发", "个性潮流"]),
  hair("long-straight", "柔顺长直发", ["柔顺直发"]),
  hair("layered-straight", "层次直发", ["柔顺直发"]),
  hair("silky-straight", "丝滑直发", ["柔顺直发"]),
  hair("center-part-straight", "中分直发", ["柔顺直发"]),
  hair("curtain-bangs", "八字刘海", ["修饰脸型"]),
  hair("face-framing-layers", "修颜层次剪", ["修饰脸型"]),
  hair("wispy-bangs", "空气刘海", ["修饰脸型"]),
  hair("butterfly-layers", "蝴蝶层次长发", ["修饰脸型"]),
  hair("classic-bob", "经典波波头", ["利落短发"]),
  hair("bixie", "精灵波波头", ["利落短发", "个性潮流"]),
  hair("pixie", "精灵短发", ["利落短发", "个性潮流"]),
  hair("hush-cut", "轻羽层次剪", ["热门", "个性潮流"]),
  color("espresso-brown", "浓咖棕", ["热门", "自然色系"]),
  color("chocolate", "巧克力色", ["热门", "自然色系"]),
  color("ash-blonde", "冷灰金", ["热门", "金色系"]),
  color("copper", "铜橘色", ["热门", "红色系"]),
  color(
    "pink",
    "樱花粉",
    ["热门", "创意色系"],
    ["流行", "活泼", "创意"],
  ),
  color("blue", "雾蓝色", ["热门", "创意色系"]),
  color("purple", "紫罗兰", ["热门", "创意色系"]),
  color("burgundy", "酒红色", ["热门", "红色系"]),
  color("black", "自然黑", ["自然色系"]),
  color("espresso", "深咖色", ["自然色系"]),
  color("chocolate-2", "巧克力棕", ["自然色系"]),
  color("ash-brown", "冷雾棕", ["自然色系"]),
  color("warm-brown", "暖茶棕", ["自然色系"]),
  color("platinum", "铂金色", ["金色系"]),
  color("honey-blonde", "蜂蜜金", ["金色系"]),
  color("champagne-blonde", "香槟金", ["金色系"]),
  color("vivid-red", "莓果红", ["红色系"]),
  color("lavender", "薰衣草紫", ["创意色系"]),
  color("rose-gold", "玫瑰金", ["创意色系"]),
  color("deep-blue", "深海蓝", ["创意色系"]),
];
export const byId = (id: string) => looks.find((x) => x.id === id)!;
export const hairstyleCategories = [
  "热门",
  "蓬松卷发",
  "柔顺直发",
  "修饰脸型",
  "利落短发",
  "个性潮流",
];
export const colorCategories = [
  "热门",
  "自然色系",
  "金色系",
  "红色系",
  "创意色系",
];
export const exploreSections = [
  {
    title: "人气发型",
    category: "热门",
    type: "hairstyle" as LookType,
    ids: ["butterfly-cut", "french-bob", "wolf-cut", "soft-layers"],
  },
  {
    title: "蓬松卷发",
    category: "蓬松卷发",
    type: "hairstyle" as LookType,
    ids: [
      "hollywood-waves",
      "soft-waves",
      "romantic-waves",
      "voluminous-curls",
    ],
  },
  {
    title: "柔顺直发",
    category: "柔顺直发",
    type: "hairstyle" as LookType,
    ids: [
      "long-straight",
      "layered-straight",
      "silky-straight",
      "center-part-straight",
    ],
  },
  {
    title: "修饰脸型",
    category: "修饰脸型",
    type: "hairstyle" as LookType,
    ids: [
      "curtain-bangs",
      "face-framing-layers",
      "wispy-bangs",
      "butterfly-layers",
    ],
  },
  {
    title: "气质短发",
    category: "利落短发",
    type: "hairstyle" as LookType,
    ids: ["french-bob", "classic-bob", "bixie", "pixie"],
  },
  {
    title: "流行发色",
    category: "热门",
    type: "color" as LookType,
    ids: [
      "espresso-brown",
      "chocolate",
      "ash-blonde",
      "copper",
      "pink",
      "blue",
      "purple",
    ],
  },
];

// Existing local hair imagery is reused for these recommendation aliases.
looks.push(
  {
    ...hair("long-layers", "长层次发", ["修饰脸型", "柔顺直发"]),
    image: img("layered-straight"),
  },
  {
    ...hair("chin-length-bob", "齐下巴波波头", ["利落短发"]),
    image: img("classic-bob"),
  },
  ...[
    [
      "classic",
      "经典肖像",
      "柔和的影棚布光，呈现自然、耐看的经典肖像。",
    ],
    ["dreamy", "梦幻光影", "轻柔光线与通透色调，营造浪漫的梦幻氛围。"],
    ["vintage", "复古胶片", "温暖胶片色调，留住充满故事感的复古瞬间。"],
    [
      "editorial",
      "时尚大片",
      "鲜明黑白光影，呈现简洁有力的杂志大片风格。",
    ],
  ].map(([id, name, description]): Look => ({
    id: `portrait-${id}`,
    name,
    description,
    type: "portrait",
    image: `${import.meta.env.BASE_URL}assets/portraits/${id}.png`,
    tags: ["艺术照", name],
    categories: ["全部", name],
  })),
);
export const portraitCategories = [
  "全部",
  "经典肖像",
  "梦幻光影",
  "复古胶片",
  "时尚大片",
];
export const typeLabel = (type: LookType) =>
  type === "color"
    ? "发色"
    : type === "portrait"
      ? "艺术照"
      : "发型";
export const libraryTitle = (type: LookType) =>
  type === "color"
    ? "发色"
    : type === "portrait"
      ? "艺术照"
      : "发型";
export const similarTitle = (type: LookType) =>
  type === "color"
    ? "更多发色"
    : type === "portrait"
      ? "更多艺术照"
      : "更多发型";
export const similarLooks = (look: Look) =>
  looks
    .filter((item) => item.type === look.type && item.id !== look.id)
    .sort(
      (a, b) =>
        Number(
          b.categories.some((category) => look.categories.includes(category)),
        ) -
        Number(
          a.categories.some((category) => look.categories.includes(category)),
        ),
    )
    .slice(0, 4);
exploreSections.push({
  title: "艺术照",
  category: "全部",
  type: "portrait",
  ids: [
    "portrait-classic",
    "portrait-dreamy",
    "portrait-vintage",
    "portrait-editorial",
  ],
});

// Concrete copy helps people choose a template before generating.
const hairstyleDescriptions: Record<string, string> = {
  "butterfly-cut": "脸侧短层次与长发尾自然衔接，吹出向外翻的弧度，呈现轻盈的蝴蝶轮廓。",
  "french-bob": "下巴附近的利落长度，搭配自然弯度，营造随性又精致的法式气质。",
  "wolf-cut": "头顶蓬松、发尾轻薄，前短后长的层次让整体更有个性。",
  "soft-layers": "用柔和、低调的层次保留长发质感，让发尾多一点自然流动。",
  "hollywood-waves": "整齐连贯的大弧度波浪，强调光泽与复古感，适合想尝试优雅造型的你。",
  "soft-waves": "松弛的小弧度从脸侧延伸至发尾，呈现自然、不刻意的微卷效果。",
  "romantic-waves": "柔软波浪与蓬松发尾相互呼应，让造型更温柔，也更有空气感。",
  "voluminous-curls": "饱满卷度增加两侧蓬松感，呈现醒目、富有活力的卷发轮廓。",
  "long-straight": "保留长发的简洁线条，顺直发丝自然垂落，呈现清爽耐看的日常造型。",
  "layered-straight": "直发中加入细腻层次，保留顺滑质感，同时让发尾更轻盈。",
  "silky-straight": "突出丝滑光泽和整齐发尾，用简洁的发型轮廓展现干净气质。",
  "center-part-straight": "中分发缝搭配垂顺长发，露出五官，让整体线条更简洁。",
  "curtain-bangs": "刘海从中间自然分开，向两侧延伸，柔和衔接额头与颧骨轮廓。",
  "face-framing-layers": "在脸颊周围加入长短层次，让发丝沿着脸部轮廓自然落下。",
  "wispy-bangs": "轻薄、带空隙的刘海，让额头若隐若现，增添轻盈柔和的感觉。",
  "butterfly-layers": "高低层次搭配向外展开的卷度，让长发呈现更明显的蓬松与流动感。",
  "classic-bob": "整齐的波波头轮廓与微微内扣的发尾，简洁利落，适合日常风格。",
  "bixie": "介于波波头和精灵短发之间，保留柔和层次，也拥有短发的轻快感。",
  "pixie": "短而利落的发型轮廓突出五官，细碎发尾让造型更轻盈。",
  "hush-cut": "羽毛般轻薄的层次与自然发尾，呈现松弛、随性的空气感。",
  "long-layers": "保留长发长度，在脸侧和发尾加入层次，减少厚重感，增加自然弧度。",
  "chin-length-bob": "发尾停在下巴附近，突出清晰的轮廓，以轻微内扣平衡脸侧线条。",
};
for (const look of looks) {
  if (hairstyleDescriptions[look.id]) look.description = hairstyleDescriptions[look.id];
}
