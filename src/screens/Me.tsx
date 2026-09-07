import { Image as ImageIcon } from "lucide-react";
import { byId } from "../data";
import type { Creation, MeFilter } from "../state/types";

export function Me({
  creations,
  filter,
  onFilter,
  onExplore,
  onOpen,
}: {
  creations: Creation[];
  filter: MeFilter;
  onFilter: (v: MeFilter) => void;
  onExplore: () => void;
  onOpen: (id: number) => void;
}) {
  const shown = creations.filter(
    (c) =>
      filter === "All" ||
      (filter === "Hairstyles" && byId(c.lookId).type === "hairstyle") ||
      (filter === "Hair Colors" && byId(c.lookId).type === "color"),
  );
  return (
    <div className="screen me" data-screen-label="My Creations">
      <header className="page-title">
        <span>YOUR GALLERY</span>
        <h1>My Creations</h1>
      </header>
      <div className="filter-tabs">
        {(["All", "Hairstyles", "Hair Colors"] as const).map((f) => (
          <button
            className={f === filter ? "active" : ""}
            onClick={() => onFilter(f)}
            key={f}
          >
            {f}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="creation-grid">
          {shown.map((c) => (
            <button key={c.id} onClick={() => onOpen(c.id)}>
              <img src={byId(c.lookId).image} alt={byId(c.lookId).name} />
            </button>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div>
            <ImageIcon />
          </div>
          <h2>No looks yet</h2>
          <p>
            Try a hairstyle or hair color
            <br />
            to see your creations here.
          </p>
          <button className="primary" onClick={onExplore}>
            Explore Looks
          </button>
        </div>
      )}
    </div>
  );
}
