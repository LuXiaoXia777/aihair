import { Sparkles } from "lucide-react";
import { similarLooks, similarTitle, typeLabel, type Look } from "../data";
import type { AIProfile } from "../state/types";
import { LookCard, Top, UsingAI } from "../components/ui";
export function Detail({
  look,
  profile,
  onBack,
  onGenerate,
  onSimilar,
}: {
  look: Look;
  profile: AIProfile | null;
  onBack: () => void;
  onGenerate: () => void;
  onSimilar: (id: string) => void;
}) {
  return (
    <div className="screen detail" data-screen-label="Template Detail">
      <Top onBack={onBack} />
      <div className="hero-photo">
        <img src={look.image} alt={look.name} />
        <span className="look-kind">{typeLabel(look.type).toUpperCase()}</span>
      </div>
      <div className="detail-copy">
        <h1>{look.name}</h1>
        <div className="tags">
          {look.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{look.description}</p>
        {profile && <UsingAI profile={profile} />}
        <button className="primary" onClick={onGenerate}>
          Generate <Sparkles size={18} />
        </button>
      </div>
      <section className="similar">
        <h2>{similarTitle(look.type)}</h2>
        <div className="look-rail">
          {similarLooks(look).map((item) => (
            <LookCard
              key={item.id}
              look={item}
              onClick={() => onSimilar(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
