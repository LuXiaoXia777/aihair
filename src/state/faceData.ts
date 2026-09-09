import type { FaceShape, MockPhoto, PhotoDraft, PhotoSlot } from "./types";
export const slots: PhotoSlot[] = ["front", "left", "right"];
export const slotLabels: Record<PhotoSlot, string> = {
  front: "正面",
  left: "左侧面",
  right: "右侧面",
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
  name: `示例照片 ${i + 1}`,
  quality: "good",
}));
// A deterministic, selectable poor-quality sample makes the validation/replacement flow testable.
export const poorPhoto: MockPhoto = {
  id: "blurry-example",
  image: mockPhotos[0].image,
  name: "模糊照片",
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
export const faceDescriptions: Record<FaceShape, string> = {
  Oval: "脸部比例均衡，下颌线柔和。可以尝试层次剪或波波头，突出自然轮廓。",
  Round: "脸部线条圆润。轻盈的长层次和八字刘海能增加纵向层次感。",
  Square: "下颌轮廓鲜明。柔和卷度和脸侧层次能让整体线条更轻盈。",
  Heart: "额头较宽、下巴收窄。下巴附近的蓬松感有助于平衡上下比例。",
  Diamond: "颧骨轮廓突出，额头与下巴较窄。轻柔刘海与脸侧卷度能柔化线条。",
  Oblong: "脸部纵向比例较长。刘海和两侧蓬松卷度能增加横向平衡感。",
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

export const faceLabels = { Oval: "椭圆脸", Round: "圆脸", Heart: "心形脸", Square: "方脸", Diamond: "菱形脸", Oblong: "长脸" };
