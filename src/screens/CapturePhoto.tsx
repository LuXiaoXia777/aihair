import { useRef, useState } from "react";
import { MoveLeft, MoveRight, RotateCcw } from "lucide-react";
import { Top } from "../components/ui";
import { slots, slotLabels } from "../state/faceData";
import type { MockPhoto, PhotoSlot, PhotoDraft } from "../state/types";

export function CapturePhoto({ slot, draft, photo, onBack, onCapture, onRetake, onGenerate, validating }: {
  slot: PhotoSlot | null;
  draft: PhotoDraft;
  photo: MockPhoto;
  onBack: () => void;
  onCapture: (photo: MockPhoto) => void;
  onRetake: (slot: PhotoSlot, photo: MockPhoto) => void;
  onGenerate: () => void;
  validating: boolean;
}) {
  const submitted = useRef(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoSlot | null>(null);
  const complete = slots.every(item => draft[item]);
  const angle = selectedPhoto ?? slot ?? "right";
  const reviewing = selectedPhoto !== null && draft[selectedPhoto] !== null;
  const previewPhoto = reviewing ? draft[selectedPhoto]! : photo;
  return (
    <div className="screen capture-screen" data-screen-label="相机拍照">
      <Top title="拍摄三张照片" onBack={onBack} />
      <div className="capture-preview">
        <img src={previewPhoto.image} alt={`${slotLabels[angle]}取景预览`} />
        <div className="capture-angle-prompt" aria-live="polite">
          {!reviewing && !complete && slot === "right" && <MoveLeft size={18} />}
          <strong>{reviewing ? `已选择${slotLabels[angle]}照片` : complete ? "三张已拍齐，点击完成" : slot === "front" ? "保持正脸，对齐虚线" : slot === "left" ? "向右转头，拍左侧脸" : "向左转头，拍右侧脸"}</strong>
          {!reviewing && !complete && slot === "left" && <MoveRight size={18} />}
        </div>
        {!reviewing && !complete && <div className={`capture-guide ${angle}`} aria-hidden="true">
          <i className="face-axis vertical" />
          <i className="face-axis horizontal" />
        </div>}
        <span>模拟取景 · 演示照片</span>
      </div>
      <div className="capture-steps" aria-label="拍摄进度">
        {slots.map((item, i) => (
          <button key={item} type="button" className={`capture-step ${draft[item] ? "filled" : ""} ${item === (selectedPhoto ?? slot) ? "active" : ""}`} aria-current={!selectedPhoto && item === slot ? "step" : undefined} aria-pressed={draft[item] ? item === selectedPhoto : undefined} onClick={() => draft[item] ? setSelectedPhoto(item) : setSelectedPhoto(null)} disabled={!draft[item] && item !== slot}>
            <span className="capture-thumb">{draft[item] ? <img src={draft[item]!.image} alt={`已拍${slotLabels[item]}照片`} /> : <i>{i + 1}</i>}</span>
            <small>{slotLabels[item]}</small>
          </button>
        ))}
      </div>
      <div className="capture-controls">
        {complete ? <button className="capture-shutter capture-complete" aria-label="完成" disabled={validating} onClick={onGenerate}><span>{validating ? "处理中" : "完成"}</span></button> : <button className="capture-shutter" aria-label={`拍摄${slotLabels[slot!]}照片`} onClick={() => {
          if (submitted.current) return;
          submitted.current = true;
          onCapture(photo);
        }}><span /></button>}
        {reviewing && <button className="capture-retake" onClick={() => onRetake(selectedPhoto!, photo)}><RotateCcw size={16} />重拍</button>}
      </div>
      <p className="capture-footnote" role="status">已拍 {slots.filter(item => draft[item]).length} / 3 张{complete ? "" : " · 拍完自动添加"}</p>
    </div>
  );
}
