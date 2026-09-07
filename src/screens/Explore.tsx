import { ChevronRight } from "lucide-react";
import { byId, exploreSections, LookType } from "../data";
import { FaceLineArt, LookCard } from "../components/ui";

export function Explore({
  onAnalyze,
  onLook,
  onAll,
}: {
  onAnalyze: () => void;
  onLook: (id: string) => void;
  onAll: (t: LookType, c: string) => void;
}) {
  return (
    <div className="screen explore" data-screen-label="Explore">
      <header className="brand-head">
        <div className="monogram">AH</div>
        <div>
          <h1>AI Hair</h1>
          <p>Find your next look.</p>
        </div>
      </header>
      <button className="face-banner" onClick={onAnalyze}>
        <span className="face-banner-copy">
          <i>PERSONALIZED PICKS</i>
          <strong>Find Your Face Shape</strong>
          <small>Discover hairstyles that suit your face shape.</small>
          <b>
            Analyze Now <ChevronRight size={15} />
          </b>
        </span>
        <FaceLineArt />
      </button>
      {exploreSections.map((s, i) => (
        <section className="rail-section" key={s.title}>
          <div className="section-head">
            <div>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.title}</h2>
            </div>
            <button onClick={() => onAll(s.type, s.category)}>
              See all <ChevronRight size={15} />
            </button>
          </div>
          <div className="look-rail">
            {s.ids.map((id) => (
              <LookCard key={id} look={byId(id)} onClick={() => onLook(id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
