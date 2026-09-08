import type { FaceShape, MockPhoto, PhotoDraft, PhotoSlot } from "./types";
export const slots: PhotoSlot[] = ["front", "left", "right"];
export const slotLabels: Record<PhotoSlot, string> = {
  front: "Front",
  left: "Left",
  right: "Right",
};
export const emptyDraft = (): PhotoDraft => ({
  front: null,
  left: null,
  right: null,
});
export const mockPhotos: MockPhoto[] = [
  "maya",
  "theo",
  "lina",
  "noah",
  "ava",
  "zayn",
].map((id, i) => ({
  id,
  image: `${import.meta.env.BASE_URL}assets/photos/${id}.webp`,
  name: `Portrait ${i + 1}`,
  quality: "good",
}));
// A deterministic, selectable poor-quality sample makes the validation/replacement flow testable.
export const poorPhoto: MockPhoto = {
  id: "blurry-example",
  image: mockPhotos[0].image,
  name: "Blurry photo",
  quality: "poor",
};
export const faceShapes: FaceShape[] = [
  "Oval",
  "Round",
  "Heart",
  "Square",
  "Diamond",
  "Oblong",
];
export const profileNames = ["Luna", "Emma", "Alex", "Mia", "Leo", "Ava"];
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
    "long-layers",
    "curtain-bangs",
  ],
  Round: [
    "face-framing-layers",
    "butterfly-cut",
    "long-layers",
    "curtain-bangs",
    "soft-waves",
  ],
  Square: ["soft-waves", "curtain-bangs", "long-layers", "romantic-waves"],
  Heart: ["french-bob", "curtain-bangs", "soft-waves", "chin-length-bob"],
  Diamond: ["soft-waves", "chin-length-bob", "curtain-bangs", "long-layers"],
  Oblong: [
    "hollywood-waves",
    "curtain-bangs",
    "french-bob",
    "voluminous-curls",
  ],
};
export const analyzeProfile = (front: MockPhoto): FaceShape =>
  faceShapes[
    Math.max(
      0,
      mockPhotos.findIndex((photo) => photo.id === front.id),
    ) % faceShapes.length
  ];
