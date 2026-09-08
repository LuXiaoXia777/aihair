import { useState } from "react";
import { Camera, Check, ChevronRight, RotateCcw } from "lucide-react";
import { Top } from "../components/ui";
import { slots, slotLabels } from "../state/faceData";
import type { MockPhoto, PhotoSlot } from "../state/types";
const guidance = {
  front: [
    "拍摄正面",
    "请平视镜头，让整张脸位于取景框内。",
  ],
  left: ["拍摄左侧面", "轻轻向右转头，露出左侧脸部轮廓。"],
  right: [
    "拍摄右侧面",
    "轻轻向左转头，露出右侧脸部轮廓。",
  ],
};
export function CapturePhoto({
  slot,
  mode,
  photo,
  onBack,
  onUse,
}: {
  slot: PhotoSlot;
  mode: "all" | "single";
  photo: MockPhoto;
  onBack: () => void;
  onUse: (photo: MockPhoto) => void;
}) {
  const [captured, setCaptured] = useState(false);
  const index = slots.indexOf(slot);
  return (
    <div className="screen capture-screen" data-screen-label="相机拍照">
      <Top title="拍摄三张照片" onBack={onBack} />
      <div className="capture-steps" aria-label="拍摄进度">
        {slots.map((item, i) => (
          <span
            key={item}
            className={item === slot ? "active" : ""}
            aria-current={item === slot ? "step" : undefined}
          >
            {mode === "all" && i < index ? <Check size={13} /> : <i>{i + 1}</i>}
            {slotLabels[item]}
          </span>
        ))}
      </div>
      <div className="capture-instructions">
        <h1>{captured ? "照片清楚吗？" : guidance[slot][0]}</h1>
        <p>
          {captured
            ? `请确认${slotLabels[slot]}照片清晰、面部完整。`
            : guidance[slot][1]}
        </p>
      </div>
      <div className={`capture-preview ${captured ? "captured" : ""}`}>
        <img
          src={photo.image}
          alt={`${slotLabels[slot]}${captured ? "已拍照片" : "取景预览"}`}
        />
        {!captured && (
          <div className={`capture-guide ${slot}`} aria-hidden="true" />
        )}
        <span>
          {captured ? `${slotLabels[slot]}照片` : "模拟取景 · 演示照片"}
        </span>
      </div>
      <div className="capture-controls">
        {captured ? (
          <>
            <button className="secondary" onClick={() => setCaptured(false)}>
              <RotateCcw size={18} />
              重拍
            </button>
            <button className="primary" onClick={() => onUse(photo)}>
              使用这张照片
              <ChevronRight size={18} />
            </button>
          </>
        ) : (
          <button
            className="primary"
            aria-label={`拍摄${slotLabels[slot]}照片`}
            onClick={() => setCaptured(true)}
          >
            <Camera size={20} />
            拍照
          </button>
        )}
      </div>
      <p className="capture-footnote">
        {mode === "all"
          ? `第 ${index + 1} / 3 张`
          : `补拍${slotLabels[slot]}照片`}
      </p>
    </div>
  );
}
