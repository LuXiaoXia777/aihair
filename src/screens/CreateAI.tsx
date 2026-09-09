import { useEffect, useState } from "react";
import {
  Check,
  Sparkles,
} from "lucide-react";
import { Top, UsingAI } from "../components/ui";
import type {
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
            "匹配推荐",
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
