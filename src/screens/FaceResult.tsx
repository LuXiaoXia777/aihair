import { ChevronRight } from "lucide-react";
import { byId } from "../data";
import { faceDescriptions } from "../state/faceData";
import type { AIProfile, RootTab } from "../state/types";
import { LookCard, Top } from "../components/ui";
export function FaceResult({
  profile,
  returnTo,
  onBack,
  onDone,
  onLook,
}: {
  profile: AIProfile;
  returnTo: RootTab;
  onBack: () => void;
  onDone: () => void;
  onLook: (id: string) => void;
}) {
  if (!profile.faceShape) return null;
  return (
    <div className="screen face-result" data-screen-label="Face Shape Result">
      <Top title="Face Shape Result" onBack={onBack} />
      <div className="face-result-hero">
        <img src={profile.avatar} alt={profile.name} />
        <span>{profile.name}</span>
      </div>
      <div className="shape-copy">
        <small>Your Face Shape</small>
        <h1>{profile.faceShape}</h1>
        <p>{faceDescriptions[profile.faceShape]}</p>
      </div>
      <section className="recommendations">
        <div className="recommendation-head">
          <span>CHOSEN FOR YOU</span>
          <h2>Recommended for You</h2>
        </div>
        <div className="library-grid">
          {profile.recommendations.map((id) => (
            <LookCard
              grid
              key={id}
              look={byId(id)}
              onClick={() => onLook(id)}
            />
          ))}
        </div>
      </section>
      <button className="primary finish-setup" onClick={onDone}>
        {returnTo === "my-ai"
          ? "Go to My AI"
          : returnTo === "creations"
            ? "Go to Creations"
            : "Explore Looks"}
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
