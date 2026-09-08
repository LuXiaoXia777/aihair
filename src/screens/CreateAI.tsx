import { useEffect, useState } from "react";
import { Check, ChevronRight, Plus, ScanFace, Sparkles } from "lucide-react";
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
      <Top title="Create Your AI" onBack={onBack} />
      <div className="create-intro-hero">
        <img src={mockPhotos[0].image} alt="Personal AI portrait" />
        <span>
          JUST THREE PHOTOS.
          <br />A WHOLE NEW YOU.
        </span>
      </div>
      <div className="setup-copy">
        <span className="eyebrow">ONCE IS ALL IT TAKES</span>
        <h1>Make it yours.</h1>
        <p>Upload 3 clear photos to create your personal AI.</p>
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
        Start <ChevronRight size={18} />
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
  onContinue,
}: {
  draft: PhotoDraft;
  errors: PhotoSlot[];
  validating: boolean;
  onBack: () => void;
  onAdd: (slot: PhotoSlot) => void;
  onContinue: () => void;
}) {
  const count = slots.filter((slot) => draft[slot]).length;
  return (
    <div className="screen profile-photos" data-screen-label="Add 3 Photos">
      <Top title="Add 3 Photos" onBack={onBack} />
      <div className="setup-copy">
        <span className="eyebrow">YOUR AI STARTS HERE</span>
        <h1>
          Three angles.
          <br />
          One you.
        </h1>
        <p>Use clear, well-lit photos.</p>
      </div>
      <div className="upload-slots">
        {slots.map((slot) => (
          <div className="upload-slot" key={slot}>
            <button
              className={`${draft[slot] ? "has-photo" : ""} ${errors.includes(slot) ? "photo-error" : ""}`}
              disabled={validating}
              onClick={() => onAdd(slot)}
              aria-label={`${draft[slot] ? "Replace" : "Add"} ${slotLabels[slot]} photo`}
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
                    alt={`${slotLabels[slot]} photo`}
                  />
                  <span>
                    <Check size={14} />
                  </span>
                </>
              ) : (
                <>
                  <Plus />
                  <small>Add Photo</small>
                </>
              )}
            </button>
            <strong>{slotLabels[slot]}</strong>
            {errors.includes(slot) && (
              <p id={`${slot}-error`} role="alert">
                This photo may not work well.
                <br />
                Please replace it.
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="photo-counter">{count} of 3 photos added</div>
      <section className="quality-guide">
        <h2>A little light goes a long way.</h2>
        <div>
          <Check size={16} />
          <p>Face clearly visible · One person · Good lighting</p>
        </div>
        <p className="avoid-copy">
          Avoid covered faces, blurry photos, or multiple people.
        </p>
      </section>
      <div className="continue-dock">
        <button
          className="primary"
          disabled={count < 3 || validating}
          onClick={onContinue}
        >
          {validating ? "Checking your photos..." : "Continue"}
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
          <img src={avatar} alt="Your AI in progress" />
          <span className="progress-ring" />
        </div>
        <h1>Creating your AI...</h1>
        <p>Preparing your personal AI model.</p>
        <ol className="progress-steps">
          {[
            "Analyzing photos",
            "Creating identity",
            "Preparing your model",
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
        <span className="eyebrow">MEET YOUR PERSONAL AI</span>
        <h1>Your AI is ready!</h1>
        <p className="ready-name">{profile.name}</p>
      </div>
      <button className="primary" onClick={onUse}>
        Use This AI <Sparkles size={18} />
      </button>
      <button className="plain" onClick={onAnother}>
        Create Another
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
        <h1>Analyzing your face shape...</h1>
        <p>Finding hairstyles that suit you.</p>
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
        <h1>Creating your new look...</h1>
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
