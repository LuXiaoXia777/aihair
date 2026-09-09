import { faceLabels } from "../state/faceData";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { byId } from "../data";
import { mockPhotos, faceDescriptions } from "../state/faceData";
import type { AIProfile } from "../state/types";
import { LookCard } from "../components/ui";
export function ProfileGate({
  onCreate,
  onSwitch,
}: {
  onCreate: () => void;
  onSwitch?: () => void;
}) {
  return (
    <section className="profile-gate">
      <div className="gate-photo">
        <img src={mockPhotos[0].image} alt="分身示例照片" />
        <span>一个分身，多种可能</span>
      </div>
      <div className="gate-copy">
        <span className="eyebrow">从你开始，发现新造型</span>
        <h1>创建专属分身</h1>
        <p>一次创建，即可体验发型、发色和艺术照。<br />选择相机拍摄三个角度，或从相册选择至少三张照片。</p>
        <button className="primary" onClick={onCreate}>
          创建我的分身 <ArrowUpRight size={18} />
        </button>
        {onSwitch && (
          <button className="plain" onClick={onSwitch}>
            选择分身
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
  onProfile,
  onLook,
}: {
  profile: AIProfile | null;
  profiles: AIProfile[];
  onCreate: () => void;
  onSwitch: () => void;
  onProfile: (profile: AIProfile) => void;
  onLook: (id: string) => void;
}) {
  return (
    <div className="screen my-ai" data-screen-label="我的分身">
      {!profile && (
        <header className="page-title">
          <span>为你而定</span>
          <h1>我的分身</h1>
        </header>
      )}
      {!profile ? (
        <ProfileGate
          onCreate={onCreate}
          onSwitch={profiles.length ? onSwitch : undefined}
        />
      ) : (
        <>
          <div className="ai-profile-hero">
            <img src={profile.avatar} alt={profile.name} />
            {profile.faceShape && (
              <div className="profile-face-summary">
                <h2>{faceLabels[profile.faceShape]}</h2>
                <p>{faceDescriptions[profile.faceShape]}</p>
              </div>
            )}
          </div>
          <section className="profiles-section">
            <h2>我的分身库</h2>
            <div className="profile-rail">
              {profiles.map((item) => (
                <button
                  key={item.id}
                  className={`profile-choice ${profile.id === item.id ? "selected" : ""}`}
                  aria-pressed={profile.id === item.id}
                  onClick={() => onProfile(item)}
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
                <strong>新建分身</strong>
              </button>
            </div>
          </section>
          {profile.faceShape && (
            <section className="rail-section profile-recommendations">
              <div className="section-head">
                <h2>适合你的发型</h2>
              </div>
              <div className="look-rail">
                {profile.recommendations.map((id) => (
                  <LookCard
                    key={id}
                    look={byId(id)}
                    onClick={() => onLook(id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
