import { ChevronDown, ChevronRight } from "lucide-react";
import { byId, exploreSections, type LookType } from "../data";
import { LookCard } from "../components/ui";
import type { AIProfile } from "../state/types";
import { ProfileGate } from "./MyAI";
export function Explore({
  profile,
  onCreate,
  onSwitch,
  hasProfiles,
  onLook,
  onAll,
}: {
  profile: AIProfile | null;
  hasProfiles: boolean;
  onCreate: () => void;
  onSwitch: () => void;
  onLook: (id: string) => void;
  onAll: (type: LookType, category: string) => void;
}) {
  return (
    <div className="screen explore" data-screen-label="Explore">
      <header className="brand-head">
        <div>
          <h1>AI Hair</h1>
          <p>Find your next look.</p>
        </div>
        {profile && (
          <button
            className="profile-chip"
            onClick={onSwitch}
            aria-label={`Switch AI, current ${profile.name}`}
          >
            <img src={profile.avatar} alt="" />
            {profile.name}
            <ChevronDown size={15} />
          </button>
        )}
      </header>
      {!profile ? (
        <ProfileGate
          onCreate={onCreate}
          onSwitch={hasProfiles ? onSwitch : undefined}
        />
      ) : (
        exploreSections.map((section, index) => (
          <section
            className="rail-section"
            key={section.title}
            aria-label={section.title}
          >
            <div className="section-head">
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              <button
                onClick={() => onAll(section.type, section.category)}
                aria-label={`See All ${section.title}`}
              >
                See All <ChevronRight size={15} />
              </button>
            </div>
            <div className="look-rail">
              {section.ids.map((id) => (
                <LookCard key={id} look={byId(id)} onClick={() => onLook(id)} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
