import { ArrowLeft, ChevronRight, Sparkles, UserRound } from "lucide-react";
import type { Look } from "../data";

export function FaceLineArt() {
  return (
    <span className="face-line-art" aria-hidden="true">
      <svg viewBox="0 0 120 150">
        <path d="M60 14c27 0 42 21 40 53-2 34-18 66-40 66S22 101 20 67C18 35 33 14 60 14Z" />
        <path d="M33 56c8-9 46-13 56 0M42 69c5-3 10-3 15 0m7 0c5-3 10-3 15 0M58 75c-2 9-3 15 3 18M49 103c7 6 17 6 24 0" />
        <path d="M22 51C24 20 41 6 61 7c28 1 39 21 38 48-9-8-15-21-17-33-13 16-31 24-60 29Z" />
      </svg>
    </span>
  );
}

export function LookCard({
  look,
  onClick,
  grid = false,
}: {
  look: Look;
  onClick: () => void;
  grid?: boolean;
}) {
  return (
    <button
      className={`look-card ${grid ? "grid-card" : ""}`}
      onClick={onClick}
    >
      <span className="image-wrap">
        <img src={look.image} alt={`${look.name} on a person`} />
        <i>{look.type === "color" ? "COLOR" : "STYLE"}</i>
      </span>
      <strong>{look.name}</strong>
    </button>
  );
}

export function Top({
  title,
  onBack,
  action,
}: {
  title?: string;
  onBack: () => void;
  action?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <button aria-label="Back" onClick={onBack}>
        <ArrowLeft />
      </button>
      {title && <h1>{title}</h1>}
      <div>{action}</div>
    </header>
  );
}

export function BottomNav({
  active,
  onGo,
}: {
  active: "explore" | "me";
  onGo: (k: "explore" | "me") => void;
}) {
  return (
    <nav className="bottom-nav">
      <button
        className={active === "explore" ? "active" : ""}
        onClick={() => onGo("explore")}
      >
        <Sparkles />
        <span>Explore</span>
      </button>
      <button
        className={active === "me" ? "active" : ""}
        onClick={() => onGo("me")}
      >
        <UserRound />
        <span>Me</span>
      </button>
    </nav>
  );
}
