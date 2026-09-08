import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  ScanFace,
  Sparkles,
} from "lucide-react";
import { Top, UsingAI } from "../components/ui";
import type {
  AIProfile,
  Creation,
} from "../state/types";
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
