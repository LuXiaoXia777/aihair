import { Images } from "lucide-react";
import type { Creation, CreationFilter } from "../state/types";
export function Creations({
  creations,
  filter,
  onFilter,
  onExplore,
  onOpen,
}: {
  creations: Creation[];
  filter: CreationFilter;
  onFilter: (filter: CreationFilter) => void;
  onExplore: () => void;
  onOpen: (id: string) => void;
}) {
  const shown = creations.filter(
    (item) =>
      filter === "All" ||
      item.type ===
        (
          {
            Hairstyles: "hairstyle",
            "Hair Colors": "color",
            Portraits: "portrait",
          } as const
        )[filter],
  );
  return (
    <div className="screen creations" data-screen-label="Creations">
      <header className="page-title">
        <span>YOUR LOOKS, ALL HERE</span>
        <h1>Creations</h1>
      </header>
      <div className="filter-tabs" aria-label="Filter creations">
        {(["All", "Hairstyles", "Hair Colors", "Portraits"] as const).map(
          (item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              aria-pressed={filter === item}
              onClick={() => onFilter(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      {shown.length ? (
        <div className="creation-grid">
          {shown.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpen(item.id)}
              aria-label={`${item.templateName}, ${item.aiProfileName}`}
            >
              <img src={item.image} alt={item.templateName} />
              <span>
                <strong>{item.templateName}</strong>
                <small>{item.aiProfileName}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div>
            <Images />
          </div>
          <h2>No creations yet</h2>
          <p>
            Explore a hairstyle, hair color or portrait
            <br />
            to create your first look.
          </p>
          <button className="primary" onClick={onExplore}>
            Explore
          </button>
        </div>
      )}
    </div>
  );
}
