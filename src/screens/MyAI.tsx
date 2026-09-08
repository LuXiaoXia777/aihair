import { faceLabels } from "../state/faceData";
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
        <img src={mockPhotos[0].image} alt="分身示例照片" />
        <span>一个分身，多种可能</span>
      </div>
      <div className="gate-copy">
        <span className="eyebrow">从你开始，发现新造型</span>
        <h1>创建专属分身</h1>
        <p>
          {myAI ? (
            "准备三张照片，创建自己的专属分身。"
          ) : (
            <>
              只需准备一次正面、左侧面、右侧面照片。
              <br />
              之后就能自由体验发型、发色和艺术照。
            </>
          )}
        </p>
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
    <div className="screen my-ai" data-screen-label="我的分身">
      <header className="page-title">
        <span>为你而定</span>
        <h1>我的分身</h1>
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
              <span>当前分身</span>
              <h2>{profile.name}</h2>
              <button onClick={onSwitch}>
                切换分身 <ChevronRight size={16} />
              </button>
            </div>
          </div>
          {profile.faceShape && (
            <>
              <section className="my-face-shape">
                <span className="eyebrow">脸型特点</span>
                <h2>{faceLabels[profile.faceShape]}</h2>
                <p>{faceDescriptions[profile.faceShape]}</p>
              </section>
              <section className="rail-section">
                <div className="section-head">
                  <h2>适合你的发型</h2>
                  <button onClick={onRecommendations}>
                    查看全部 <ChevronRight size={15} />
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
            <h2>我的分身库</h2>
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
                <strong>新建分身</strong>
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
