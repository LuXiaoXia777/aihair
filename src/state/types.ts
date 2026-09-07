import type { LookType } from "../data";
export type Screen =
  | { kind: "explore" }
  | { kind: "face-analysis" }
  | { kind: "photo-selection"; source: "look" | "face"; lookId?: string }
  | { kind: "library"; type: LookType; category: string }
  | { kind: "detail"; id: string; fromAnalysis?: boolean }
  | { kind: "result"; result: Creation }
  | { kind: "me" }
  | { kind: "creation"; creationId: number };
export type Creation = {
  id: number;
  lookId: string;
  photo: string;
  createdAt: number;
};
export type FaceShape =
  "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong";
export type FaceAnalysisStatus = "idle" | "analyzing" | "result";
export type MeFilter = "All" | "Hairstyles" | "Hair Colors";
