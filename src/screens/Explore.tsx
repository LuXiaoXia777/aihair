import { ChevronDown, ChevronRight, UserRoundPlus } from "lucide-react";
import { byId, exploreSections, type LookType } from "../data";
import { LookCard } from "../components/ui";
import type { AIProfile } from "../state/types";
export function Explore({
  profile,
  onCreate,
  onSwitch,
  onLook,
  onAll,
}: {
  profile: AIProfile | null;
  onCreate: () => void;
  onSwitch: () => void;
  onLook: (id: string) => void;
  onAll: (type: LookType, category: string) => void;
}) {
  return (
    <div className="screen explore" data-screen-label="发现">
      <header className="brand-head">
        <div>
          <h1>发型灵感</h1>
          <p>找到适合你的新造型</p>
        </div>
        {profile && (
          <button
            className="profile-chip"
            onClick={onSwitch}
            aria-label={`切换分身，当前${profile.name}`}
          >
            <img src={profile.avatar} alt="" />
            {profile.name}
            <ChevronDown size={15} />
          </button>
        )}
      </header>
      <button className="create-model-banner" onClick={onCreate} aria-label="创建我的模特">
        <span className="banner-icon"><UserRoundPlus size={22} /></span>
        <span className="banner-copy"><strong>创建我的模特</strong><small>三张照片，开启你的专属造型</small></span>
        <ChevronRight size={18} />
      </button>
      {exploreSections.map((section) => (
          <section
            className="rail-section"
            key={section.title}
            aria-label={section.title}
          >
            <div className="section-head">
              <div>
                <h2>{section.title}</h2>
              </div>
              <button
                onClick={() => onAll(section.type, section.category)}
                aria-label={`查看全部${section.title}`}
              >
                查看全部 <ChevronRight size={15} />
              </button>
            </div>
            <div className="look-rail">
              {section.ids.map((id) => (
                <LookCard key={id} look={byId(id)} onClick={() => onLook(id)} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
