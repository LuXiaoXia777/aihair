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
export type AIProfile = {
  id: string;
  name: string;
  avatar: string;
  photos: Record<PhotoSlot, MockPhoto>;
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
export type CreationFilter = "全部" | "发型" | "发色" | "艺术照";
export type Screen =
  | { kind: RootTab }
  | { kind: "library"; type: LookType; category: string }
  | { kind: "detail"; id: string }
  | { kind: "generating"; result: Creation }
  | { kind: "result"; result: Creation }
  | { kind: "creation"; creationId: string }
  | { kind: "create-intro"; returnTo: RootTab }
  | { kind: "profile-photos"; returnTo: RootTab }
  | { kind: "camera"; slot: PhotoSlot }
  | {
      kind: "validating";
      returnTo: RootTab;
      photos: Record<PhotoSlot, MockPhoto>;
    }
  | { kind: "creating-ai"; returnTo: RootTab; profile: AIProfile }
  | { kind: "ai-ready"; returnTo: RootTab; profileId: string }
  | { kind: "analyzing-ai"; returnTo: RootTab; profileId: string }
  | { kind: "face-result"; profileId: string; returnTo: RootTab };
export type ActiveSheet =
  | null
  | { kind: "picker"; slot: PhotoSlot }
  | { kind: "switch" }
  | { kind: "delete"; creationId: string };
