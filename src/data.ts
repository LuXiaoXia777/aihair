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
  tags = ["Polished", "Modern", "Wearable"],
): Look => ({
  id,
  name,
  type: "hairstyle",
  image: img(id),
  tags,
  description: `A modern ${name.toLowerCase()} with soft movement and an effortless finish.`,
  categories,
});
const color = (
  id: string,
  name: string,
  categories: string[],
  tags = ["Fresh", "Expressive", "Luminous"],
): Look => ({
  id,
  name,
  type: "color",
  image: img(id),
  tags,
  description: `A dimensional ${name.toLowerCase()} shade for a fresh, luminous look.`,
  categories,
});
export const looks: Look[] = [
  hair(
    "butterfly-cut",
    "Butterfly Cut",
    ["Trending", "Face-Framing"],
    ["Layers", "Face-framing", "Trendy"],
  ),
  hair("french-bob", "French Bob", ["Trending", "Chic Short"]),
  hair("wolf-cut", "Wolf Cut", ["Trending", "Bold & Trendy"]),
  hair("soft-layers", "Soft Layers", ["Trending", "Face-Framing"]),
  hair("hollywood-waves", "Hollywood Waves", ["Glam Waves"]),
  hair("soft-waves", "Soft Waves", ["Glam Waves"]),
  hair("romantic-waves", "Romantic Waves", ["Glam Waves"]),
  hair("voluminous-curls", "Voluminous Curls", ["Glam Waves", "Bold & Trendy"]),
  hair("long-straight", "Long Straight", ["Sleek & Straight"]),
  hair("layered-straight", "Layered Straight", ["Sleek & Straight"]),
  hair("silky-straight", "Silky Straight", ["Sleek & Straight"]),
  hair("center-part-straight", "Center-Part Straight", ["Sleek & Straight"]),
  hair("curtain-bangs", "Curtain Bangs", ["Face-Framing"]),
  hair("face-framing-layers", "Face-Framing Layers", ["Face-Framing"]),
  hair("wispy-bangs", "Wispy Bangs", ["Face-Framing"]),
  hair("butterfly-layers", "Butterfly Layers", ["Face-Framing"]),
  hair("classic-bob", "Classic Bob", ["Chic Short"]),
  hair("bixie", "Bixie", ["Chic Short", "Bold & Trendy"]),
  hair("pixie", "Pixie", ["Chic Short", "Bold & Trendy"]),
  hair("hush-cut", "Hush Cut", ["Trending", "Bold & Trendy"]),
  color("espresso-brown", "Espresso Brown", ["Trending", "Natural"]),
  color("chocolate", "Chocolate", ["Trending", "Natural"]),
  color("ash-blonde", "Ash Blonde", ["Trending", "Blonde"]),
  color("copper", "Copper", ["Trending", "Red"]),
  color(
    "pink",
    "Pink",
    ["Trending", "Fantasy"],
    ["Trendy", "Playful", "Creative"],
  ),
  color("blue", "Blue", ["Trending", "Fantasy"]),
  color("purple", "Purple", ["Trending", "Fantasy"]),
  color("burgundy", "Burgundy", ["Trending", "Red"]),
  color("black", "Black", ["Natural"]),
  color("espresso", "Espresso", ["Natural"]),
  color("chocolate-2", "Chocolate Brown", ["Natural"]),
  color("ash-brown", "Ash Brown", ["Natural"]),
  color("warm-brown", "Warm Brown", ["Natural"]),
  color("platinum", "Platinum", ["Blonde"]),
  color("honey-blonde", "Honey Blonde", ["Blonde"]),
  color("champagne-blonde", "Champagne Blonde", ["Blonde"]),
  color("vivid-red", "Vivid Red", ["Red"]),
  color("lavender", "Lavender", ["Fantasy"]),
  color("rose-gold", "Rose Gold", ["Fantasy"]),
  color("deep-blue", "Deep Blue", ["Fantasy"]),
];
export const byId = (id: string) => looks.find((x) => x.id === id)!;
export const hairstyleCategories = [
  "Trending",
  "Glam Waves",
  "Sleek & Straight",
  "Face-Framing",
  "Chic Short",
  "Bold & Trendy",
];
export const colorCategories = [
  "Trending",
  "Natural",
  "Blonde",
  "Red",
  "Fantasy",
];
export const exploreSections = [
  {
    title: "Trending Now",
    category: "Trending",
    type: "hairstyle" as LookType,
    ids: ["butterfly-cut", "french-bob", "wolf-cut", "soft-layers"],
  },
  {
    title: "Glam Waves",
    category: "Glam Waves",
    type: "hairstyle" as LookType,
    ids: [
      "hollywood-waves",
      "soft-waves",
      "romantic-waves",
      "voluminous-curls",
    ],
  },
  {
    title: "Sleek & Straight",
    category: "Sleek & Straight",
    type: "hairstyle" as LookType,
    ids: [
      "long-straight",
      "layered-straight",
      "silky-straight",
      "center-part-straight",
    ],
  },
  {
    title: "Face-Framing",
    category: "Face-Framing",
    type: "hairstyle" as LookType,
    ids: [
      "curtain-bangs",
      "face-framing-layers",
      "wispy-bangs",
      "butterfly-layers",
    ],
  },
  {
    title: "Chic Short Hair",
    category: "Chic Short",
    type: "hairstyle" as LookType,
    ids: ["french-bob", "classic-bob", "bixie", "pixie"],
  },
  {
    title: "Trending Hair Colors",
    category: "Trending",
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
    ...hair("long-layers", "Long Layers", ["Face-Framing", "Sleek & Straight"]),
    image: img("layered-straight"),
  },
  {
    ...hair("chin-length-bob", "Chin-Length Bob", ["Chic Short"]),
    image: img("classic-bob"),
  },
  ...[
    [
      "classic",
      "Classic",
      "Timeless studio light and an effortlessly elegant finish.",
    ],
    ["dreamy", "Dreamy", "Soft light and an airy, romantic atmosphere."],
    ["vintage", "Vintage", "Warm film tones with a little nostalgia."],
    [
      "editorial",
      "Editorial",
      "Bold black-and-white light, made for the spotlight.",
    ],
  ].map(([id, name, description]): Look => ({
    id: `portrait-${id}`,
    name,
    description,
    type: "portrait",
    image: `${import.meta.env.BASE_URL}assets/portraits/${id}.png`,
    tags: ["Portrait", name],
    categories: ["All", name],
  })),
);
export const portraitCategories = [
  "All",
  "Classic",
  "Dreamy",
  "Vintage",
  "Editorial",
];
export const typeLabel = (type: LookType) =>
  type === "color"
    ? "Hair Color"
    : type === "portrait"
      ? "Portrait"
      : "Hairstyle";
export const libraryTitle = (type: LookType) =>
  type === "color"
    ? "Hair Colors"
    : type === "portrait"
      ? "AI Portraits"
      : "Hairstyles";
export const similarTitle = (type: LookType) =>
  type === "color"
    ? "Similar Colors"
    : type === "portrait"
      ? "Similar Portraits"
      : "Similar Looks";
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
  title: "AI Portraits",
  category: "All",
  type: "portrait",
  ids: [
    "portrait-classic",
    "portrait-dreamy",
    "portrait-vintage",
    "portrait-editorial",
  ],
});
