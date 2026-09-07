import { colorCategories, hairstyleCategories, looks } from "../data";
import type { Screen } from "../state/types";
import { LookCard, Top } from "../components/ui";

export function Library({
  screen,
  onBack,
  onLook,
  onCategory,
}: {
  screen: Extract<Screen, { kind: "library" }>;
  onBack: () => void;
  onLook: (id: string) => void;
  onCategory: (category: string) => void;
}) {
  const cats =
    screen.type === "hairstyle" ? hairstyleCategories : colorCategories;
  const cat = screen.category;
  const items = looks.filter(
    (l) => l.type === screen.type && l.categories.includes(cat),
  );
  return (
    <div className="screen" data-screen-label="Library">
      <Top
        title={screen.type === "hairstyle" ? "Hairstyles" : "Hair Colors"}
        onBack={onBack}
      />
      <div className="category-tabs">
        {cats.map((c) => (
          <button
            className={c === cat ? "active" : ""}
            onClick={() => onCategory(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="library-grid">
        {items.map((l) => (
          <LookCard grid key={l.id} look={l} onClick={() => onLook(l.id)} />
        ))}
      </div>
    </div>
  );
}
