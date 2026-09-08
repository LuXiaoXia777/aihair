import { ArrowUpRight, Check, ChevronRight, Plus } from "lucide-react";
import { byId } from "../data";
import { mockPhotos, faceDescriptions } from "../state/faceData";
import type { AIProfile } from "../state/types";
import { LookCard } from "../components/ui";
export function ProfileGate({
  onCreate,
  onSwitch,
  myAI = false,
}: {
  onCreate: () => void;
  onSwitch?: () => void;
  myAI?: boolean;
}) {
  return (
    <section className="profile-gate">
      <div className="gate-photo">
        <img src={mockPhotos[0].image} alt="Your personal AI portrait" />
        <span>ONE AI. ENDLESS LOOKS.</span>
      </div>
      <div className="gate-copy">
        <span className="eyebrow">YOUR LOOK STARTS WITH YOU</span>
        <h1>Create Your AI</h1>
        <p>
          {myAI ? (
            "Create your personal AI model with 3 photos."
          ) : (
            <>
              Upload 3 photos once.
              <br />
              Then try any hairstyle, hair color or portrait instantly.
            </>
          )}
        </p>
        <button className="primary" onClick={onCreate}>
          Create My AI <ArrowUpRight size={18} />
        </button>
        {onSwitch && (
          <button className="plain" onClick={onSwitch}>
            Choose Your AI
          </button>
        )}
      </div>
    </section>
  );
}
export function MyAI({
  profile,
  profiles,
  onCreate,
  onSwitch,
  onSelect,
  onLook,
  onRecommendations,
}: {
  profile: AIProfile | null;
  profiles: AIProfile[];
  onCreate: () => void;
  onSwitch: () => void;
  onSelect: (profile: AIProfile) => void;
  onLook: (id: string) => void;
  onRecommendations: () => void;
}) {
  return (
    <div className="screen my-ai" data-screen-label="My AI">
      <header className="page-title">
        <span>MADE AROUND YOU</span>
        <h1>My AI</h1>
      </header>
      {!profile ? (
        <ProfileGate
          myAI
          onCreate={onCreate}
          onSwitch={profiles.length ? onSwitch : undefined}
        />
      ) : (
        <>
          <div className="ai-profile-hero">
            <img src={profile.avatar} alt={profile.name} />
            <div>
              <span>YOUR PERSONAL AI</span>
              <h2>{profile.name}</h2>
              <button onClick={onSwitch}>
                Switch AI <ChevronRight size={16} />
              </button>
            </div>
          </div>
          {profile.faceShape && (
            <>
              <section className="my-face-shape">
                <span className="eyebrow">FACE SHAPE</span>
                <h2>{profile.faceShape}</h2>
                <p>{faceDescriptions[profile.faceShape]}</p>
              </section>
              <section className="rail-section">
                <div className="section-head">
                  <h2>Recommended for You</h2>
                  <button onClick={onRecommendations}>
                    See All <ChevronRight size={15} />
                  </button>
                </div>
                <div className="look-rail">
                  {profile.recommendations.slice(0, 3).map((id) => (
                    <LookCard
                      key={id}
                      look={byId(id)}
                      onClick={() => onLook(id)}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
          <section className="profiles-section">
            <h2>My AI Profiles</h2>
            <div className="profile-rail">
              {profiles.map((item) => (
                <button
                  key={item.id}
                  className={`profile-choice ${profile.id === item.id ? "selected" : ""}`}
                  aria-pressed={profile.id === item.id}
                  onClick={() => onSelect(item)}
                >
                  <span>
                    <img src={item.avatar} alt="" />
                    {profile.id === item.id && (
                      <i>
                        <Check size={12} />
                      </i>
                    )}
                  </span>
                  <strong>{item.name}</strong>
                </button>
              ))}
              <button className="new-profile" onClick={onCreate}>
                <span>
                  <Plus />
                </span>
                <strong>New AI</strong>
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
