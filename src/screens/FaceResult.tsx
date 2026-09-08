import { faceLabels } from "../state/faceData";
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
    <div className="screen face-result" data-screen-label="脸型与推荐">
      <Top title="脸型与推荐" onBack={onBack} />
      <div className="face-result-hero">
        <img src={profile.avatar} alt={profile.name} />
        <span>{profile.name}</span>
      </div>
      <div className="shape-copy">
        <small>你的脸型</small>
        <h1>{faceLabels[profile.faceShape]}</h1>
        <p>{faceDescriptions[profile.faceShape]}</p>
      </div>
      <section className="recommendations">
        <div className="recommendation-head">
          <span>根据脸型精选</span>
          <h2>适合你的发型</h2>
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
          ? "返回我的分身"
          : returnTo === "creations"
            ? "返回作品"
            : "去发现新造型"}
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
