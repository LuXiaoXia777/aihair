import { Scissors, Sparkles } from "lucide-react";
import { Look, looks } from "../data";
import { LookCard, Top } from "../components/ui";

export function Detail({
  look,
  generating,
  onBack,
  onTry,
  onSimilar,
}: {
  look: Look;
  generating: boolean;
  onBack: () => void;
  onTry: () => void;
  onSimilar: (id: string) => void;
}) {
  const similar = looks
    .filter((l) => l.type === look.type && l.id !== look.id)
    .slice(0, 4);
  if (generating)
    return (
      <div className="screen generating" data-screen-label="Generating">
        <div className="loader">
          <span></span>
          <Scissors size={29} />
        </div>
        <h1>Creating your new look...</h1>
        <p>This may take a few seconds.</p>
      </div>
    );
  return (
    <div className="screen detail" data-screen-label="Look Detail">
      <Top onBack={onBack} />
      <div className="hero-photo">
        <img src={look.image} alt={look.name} />
        <span className="look-kind">
          {look.type === "color" ? "HAIR COLOR" : "HAIRSTYLE"}
        </span>
      </div>
      <div className="detail-copy">
        <h1>{look.name}</h1>
        <div className="tags">
          {look.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <p>{look.description}</p>
        <button className="primary" onClick={onTry}>
          {look.type === "color" ? "Try This Color" : "Try This Look"}{" "}
          <Sparkles size={18} />
        </button>
      </div>
      <section className="similar">
        <h2>{look.type === "color" ? "Similar Colors" : "Similar Looks"}</h2>
        <div className="look-rail">
          {similar.map((l) => (
            <LookCard look={l} key={l.id} onClick={() => onSimilar(l.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
