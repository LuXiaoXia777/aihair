import type { LookType } from "../data";
export type RootTab = "explore" | "my-ai" | "creations";
export type FaceShape =
  "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong";
export type PhotoSlot = "front" | "left" | "right";
export type MockPhoto = {
  id: string;
  image: string;
  name: string;
  quality: "good" | "poor";
};
export type PhotoDraft = Record<PhotoSlot, MockPhoto | null>;
export type SetupSource = "photos" | "camera";
export type AIProfile = {
  id: string;
  name: string;
  avatar: string;
  photos: Record<PhotoSlot, MockPhoto>;
  sourcePhotos: MockPhoto[];
  faceShape: FaceShape | null;
  recommendations: string[];
};
export type Creation = {
  id: string;
  type: LookType;
  templateId: string;
  templateName: string;
  aiProfileId: string;
  aiProfileName: string;
  aiProfileAvatar: string;
  image: string;
  createdAt: number;
};
export type Screen =
  | { kind: RootTab }
  | { kind: "settings" }
  | { kind: "agreement"; agreement: "privacy" | "terms" }
  | { kind: "library"; type: LookType; category: string }
  | { kind: "detail"; id: string }
  | { kind: "generating"; result: Creation }
  | { kind: "result"; result: Creation }
  | { kind: "creation"; creationId: string }
  | { kind: "photo-upload"; returnTo: RootTab }
  | { kind: "camera"; slot: PhotoSlot | null; returnTo: RootTab }
  | { kind: "validating"; returnTo: RootTab; source: SetupSource; photos: MockPhoto[] }
  | { kind: "creating-ai"; returnTo: RootTab; source: SetupSource; profile: AIProfile };
export type ActiveSheet =
  | null
  | { kind: "create-source"; returnTo: RootTab }
  | { kind: "switch" }
  | { kind: "delete"; creationId: string };
