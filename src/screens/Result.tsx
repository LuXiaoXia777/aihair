import { Download } from "lucide-react";
import { Look, looks } from "../data";
import { LookCard, Top } from "../components/ui";
import { ResultPhoto } from "../components/ResultPhoto";

export function Result({
  look,
  before,
  saved,
  onBack,
  onSave,
  onAnother,
  onMore,
  onDownload,
}: {
  look: Look;
  before: string;
  saved: boolean;
  onBack: () => void;
  onSave: () => void;
  onAnother: () => void;
  onMore: (id: string) => void;
  onDownload: () => void;
}) {
  const similar = looks
    .filter((l) => l.type === look.type && l.id !== look.id)
    .slice(4, 8);
  return (
    <div className="screen result" data-screen-label="Result">
      <Top
        onBack={onBack}
        action={
          <button aria-label="Download" onClick={onDownload}>
            <Download />
          </button>
        }
      />
      <ResultPhoto
        key={`${look.id}:${before}`}
        original={before}
        result={look.image}
      />
      <div className="result-copy">
        <span>Your new look</span>
        <h1>{look.name}</h1>
        <div className="result-actions">
          <button
            className={`primary ${saved ? "saved" : ""}`}
            onClick={onSave}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
          <button className="secondary" onClick={onAnother}>
            {look.type === "color" ? "Try Another Color" : "Try Another Look"}
          </button>
        </div>
      </div>
      <section className="similar">
        <h2>More Like This</h2>
        <div className="look-rail">
          {similar.map((l) => (
            <LookCard look={l} key={l.id} onClick={() => onMore(l.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
