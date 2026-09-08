import { useRef } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { Top } from "../components/ui";
import { slots, slotLabels } from "../state/faceData";
import type { MockPhoto, PhotoSlot, PhotoDraft } from "../state/types";

export function CapturePhoto({ slot, draft, photo, onBack, onCapture, onGenerate, validating }: {
  slot: PhotoSlot | null;
  draft: PhotoDraft;
  photo: MockPhoto;
  onBack: () => void;
  onCapture: (photo: MockPhoto) => void;
  onGenerate: () => void;
  validating: boolean;
}) {
  const submitted = useRef(false);
  const complete = slots.every(item => draft[item]);
  const angle = slot ?? "right";
  return (
    <div className="screen capture-screen" data-screen-label="相机拍照">
      <Top title="拍摄三张照片" onBack={onBack} />
      <div className="capture-preview">
        <img src={photo.image} alt={`${slotLabels[angle]}取景预览`} />
        <div className="capture-angle-prompt" aria-live="polite">
          {!complete && slot === "right" && <MoveLeft size={18} />}
          <strong>{complete ? "三张已拍齐，点击确定生成" : slot === "front" ? "保持正脸，对齐虚线" : slot === "left" ? "向右转头，拍左侧脸" : "向左转头，拍右侧脸"}</strong>
          {!complete && slot === "left" && <MoveRight size={18} />}
        </div>
        {!complete && <div className={`capture-guide ${angle}`} aria-hidden="true">
          <i className="face-axis vertical" />
          <i className="face-axis horizontal" />
        </div>}
        <span>模拟取景 · 演示照片</span>
      </div>
      <div className="capture-steps" aria-label="拍摄进度">
        {slots.map((item, i) => (
          <span key={item} className={item === slot ? "active" : ""} aria-current={item === slot ? "step" : undefined}>
            <span className="capture-thumb">{draft[item] ? <img src={draft[item]!.image} alt={`已拍${slotLabels[item]}照片`} /> : <i>{i + 1}</i>}</span>
            <small>{slotLabels[item]}</small>
          </span>
        ))}
      </div>
      <div className="capture-controls">
        {complete ? <button className="primary capture-confirm" disabled={validating} onClick={onGenerate}>{validating ? "正在检查照片…" : "确定"}</button> : <button className="capture-shutter" aria-label={`拍摄${slotLabels[angle]}照片`} onClick={() => {
          if (submitted.current) return;
          submitted.current = true;
          onCapture(photo);
        }}><span /></button>}
      </div>
      <p className="capture-footnote" role="status">已拍 {slots.filter(item => draft[item]).length} / 3 张{complete ? "" : " · 拍完自动添加"}</p>
    </div>
  );
}
