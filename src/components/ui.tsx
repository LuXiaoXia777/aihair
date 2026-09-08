import { ArrowLeft, Images, Sparkles, UserRound } from "lucide-react";
import type { Look } from "../data";
import type { AIProfile, RootTab } from "../state/types";
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
      aria-label={look.name}
    >
      <span className="image-wrap">
        <img src={look.image} alt={`${look.name} on a person`} />
        <i>
          {look.type === "color"
            ? "COLOR"
            : look.type === "portrait"
              ? "PORTRAIT"
              : "STYLE"}
        </i>
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
      <div>{title && <h1>{title}</h1>}</div>
      <div>{action}</div>
    </header>
  );
}
export function BottomNav({
  active,
  onGo,
}: {
  active: RootTab;
  onGo: (tab: RootTab) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {(
        [
          ["explore", "Explore", Sparkles],
          ["my-ai", "My AI", UserRound],
          ["creations", "Creations", Images],
        ] as const
      ).map(([id, label, Icon]) => (
        <button
          key={id}
          className={active === id ? "active" : ""}
          aria-current={active === id ? "page" : undefined}
          onClick={() => onGo(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
export function UsingAI({
  profile,
}: {
  profile: Pick<AIProfile, "name" | "avatar">;
}) {
  return (
    <div className="using-ai">
      <img src={profile.avatar} alt="" />
      <span>Using {profile.name}</span>
    </div>
  );
}
