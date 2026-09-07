import type { FaceShape } from "./types";
export const photos = ["maya", "theo", "lina", "noah", "ava", "zayn"].map(
  (n) => `${import.meta.env.BASE_URL}assets/photos/${n}.webp`,
);
export const faceShapes: FaceShape[] = [
  "Oval",
  "Round",
  "Heart",
  "Square",
  "Diamond",
  "Oblong",
];
export const faceDescriptions: Record<FaceShape, string> = {
  Oval: "Balanced proportions with a softly rounded jawline.",
  Round: "Soft curves with balanced width and length.",
  Square: "Defined angles with a strong, balanced jawline.",
  Heart: "A wider forehead with a softly tapered chin.",
  Diamond: "Defined cheekbones with a softly tapered forehead and chin.",
  Oblong: "Balanced features with a longer, softly structured shape.",
};
export const faceRecommendations: Record<FaceShape, string[]> = {
  Oval: [
    "butterfly-cut",
    "french-bob",
    "soft-waves",
    "long-straight",
    "curtain-bangs",
  ],
  Round: [
    "face-framing-layers",
    "butterfly-cut",
    "layered-straight",
    "curtain-bangs",
    "soft-waves",
  ],
  Square: [
    "soft-waves",
    "curtain-bangs",
    "soft-layers",
    "romantic-waves",
    "butterfly-layers",
  ],
  Heart: [
    "french-bob",
    "curtain-bangs",
    "soft-waves",
    "classic-bob",
    "face-framing-layers",
  ],
  Diamond: [
    "soft-waves",
    "classic-bob",
    "curtain-bangs",
    "layered-straight",
    "hollywood-waves",
  ],
  Oblong: [
    "hollywood-waves",
    "curtain-bangs",
    "french-bob",
    "soft-layers",
    "voluminous-curls",
  ],
};
