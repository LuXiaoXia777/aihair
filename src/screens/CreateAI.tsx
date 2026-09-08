import { useEffect, useState } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  Plus,
  ScanFace,
  Sparkles,
} from "lucide-react";
import { Top, UsingAI } from "../components/ui";
import { mockPhotos, slotLabels, slots } from "../state/faceData";
import type {
  AIProfile,
  Creation,
  PhotoDraft,
  PhotoSlot,
} from "../state/types";
export function CreateIntro({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <div className="screen create-intro" data-screen-label="Create AI">
      <Top title="创建专属分身" onBack={onBack} />
      <div className="create-intro-hero">
        <img src={mockPhotos[0].image} alt="分身示例照片" />
        <span>
          准备三张照片
          <br />开启新的自己
        </span>
      </div>
      <div className="setup-copy">
        <span className="eyebrow">一次创建，反复体验</span>
        <h1>让每个造型都属于你</h1>
        <p>拍摄或选择同一个人的三张清晰照片。</p>
      </div>
      <div className="angle-guide">
        {slots.map((slot, index) => (
          <div key={slot}>
            <ScanFace
              style={{
                transform: `rotateY(${index === 1 ? "-35deg" : index === 2 ? "35deg" : "0deg"})`,
              }}
            />
            <span>{slotLabels[slot]}</span>
          </div>
        ))}
      </div>
      <button className="primary" onClick={onStart}>
        开始创建 <ChevronRight size={18} />
      </button>
    </div>
  );
}
export function ProfilePhotos({
  draft,
  errors,
  validating,
  onBack,
  onAdd,
  onCamera,
  onContinue,
}: {
  draft: PhotoDraft;
  errors: PhotoSlot[];
  validating: boolean;
  onBack: () => void;
  onAdd: (slot: PhotoSlot) => void;
  onCamera: () => void;
  onContinue: () => void;
}) {
  const count = slots.filter((slot) => draft[slot]).length;
  return (
    <div className="screen profile-photos" data-screen-label="添加三张照片">
      <Top title="添加三张照片" onBack={onBack} />
      <div className="setup-copy">
        <span className="eyebrow">创建分身 · 照片准备</span>
        <h1>
          三个角度，
          <br />
          记录完整的你
        </h1>
        <p>请准备同一个人的正面和左右侧面照片。</p>
      </div>
      <button
        className="secondary take-photos"
        disabled={validating}
        onClick={onCamera}
      >
        <Camera size={20} />
        拍摄三张照片
      </button>
      <p className="photo-source-hint">
        跟随引导，依次拍摄三个角度。
        <br />
        也可以点击下方位置，分别拍照或选图。
      </p>
      <div className="upload-slots">
        {slots.map((slot) => (
          <div className="upload-slot" key={slot}>
            <button
              className={`${draft[slot] ? "has-photo" : ""} ${errors.includes(slot) ? "photo-error" : ""}`}
              disabled={validating}
              onClick={() => onAdd(slot)}
              aria-label={`${draft[slot] ? "更换" : "添加"}${slotLabels[slot]}照片`}
              aria-invalid={errors.includes(slot)}
              aria-describedby={
                errors.includes(slot) ? `${slot}-error` : undefined
              }
            >
              {draft[slot] ? (
                <>
                  <img
                    className={
                      draft[slot]?.quality === "poor" ? "blurred-sample" : ""
                    }
                    src={draft[slot]!.image}
                    alt={`${slotLabels[slot]}照片`}
                  />
                  <span>
                    <Check size={14} />
                  </span>
                </>
              ) : (
                <>
                  <Plus />
                  <small>添加照片</small>
                </>
              )}
            </button>
            <strong>{slotLabels[slot]}</strong>
            {errors.includes(slot) && (
              <p id={`${slot}-error`} role="alert">
                这张照片不够清晰，
                <br />
                请重新拍摄或选择。
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="photo-counter">已添加 {count} / 3 张照片</div>
      <section className="quality-guide">
        <h2>这样拍，效果更好</h2>
        <div>
          <Check size={16} />
          <p>面部无遮挡 · 单人入镜 · 光线充足</p>
        </div>
        <p className="avoid-copy">
          避免模糊、逆光、多人合影，三张照片须为同一人。
        </p>
      </section>
      <div className="continue-dock">
        <button
          className="primary"
          disabled={count < 3 || validating}
          onClick={onContinue}
        >
          {validating ? "正在检查照片…" : "下一步"}
          {!validating && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}
export function CreatingAI({
  avatar,
  onBack,
}: {
  avatar: string;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setStep((value) => Math.min(2, value + 1)),
      400,
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="screen ai-progress" data-screen-label="Creating AI">
      <Top onBack={onBack} />
      <div className="progress-content">
        <div className="profile-progress-photo">
          <img src={avatar} alt="正在创建的分身" />
          <span className="progress-ring" />
        </div>
        <h1>正在创建分身…</h1>
        <p>正在整理照片，建立你的专属分身。</p>
        <ol className="progress-steps">
          {[
            "检查照片",
            "建立分身",
            "准备就绪",
          ].map((label, index) => (
            <li key={label} className={index <= step ? "active" : ""}>
              {index < step ? <Check size={14} /> : <i />}
              {label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
export function AIReady({
  profile,
  onBack,
  onUse,
  onAnother,
}: {
  profile: AIProfile;
  onBack: () => void;
  onUse: () => void;
  onAnother: () => void;
}) {
  return (
    <div className="screen ai-ready" data-screen-label="AI Profile Created">
      <Top onBack={onBack} />
      <div className="ready-hero">
        <img src={profile.avatar} alt={profile.name} />
        <span>
          <Check size={22} />
        </span>
      </div>
      <div className="setup-copy">
        <span className="eyebrow">专属分身，准备就绪</span>
        <h1>你的分身已就绪</h1>
        <p className="ready-name">{profile.name}</p>
      </div>
      <button className="primary" onClick={onUse}>
        使用这个分身 <Sparkles size={18} />
      </button>
      <button className="plain" onClick={onAnother}>
        再创建一个
      </button>
    </div>
  );
}
export function AnalyzingAI({
  profile,
  onBack,
}: {
  profile: AIProfile;
  onBack: () => void;
}) {
  return (
    <div className="screen ai-progress" data-screen-label="Analyzing Face">
      <Top onBack={onBack} />
      <div className="analysis-photo">
        <img src={profile.avatar} alt={profile.name} />
        <span className="scan-line" />
      </div>
      <div className="analysis-progress">
        <div className="loader small">
          <span />
          <ScanFace size={25} />
        </div>
        <h1>正在分析脸型…</h1>
        <p>为你挑选更适合的发型。</p>
      </div>
    </div>
  );
}
export function Generating({
  result,
  onBack,
}: {
  result: Creation;
  onBack: () => void;
}) {
  return (
    <div className="screen generation-screen" data-screen-label="Generating">
      <img className="generation-background" src={result.image} alt="" />
      <Top onBack={onBack} />
      <div className="generation-content">
        <div className="loader">
          <span />
          <Sparkles size={29} />
        </div>
        <h1>正在生成新造型…</h1>
        <UsingAI
          profile={{
            name: result.aiProfileName,
            avatar: result.aiProfileAvatar,
          }}
        />
      </div>
    </div>
  );
}
