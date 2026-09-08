import { useRef } from "react";
import { Camera, Check, MoveLeft, MoveRight } from "lucide-react";
import { Top } from "../components/ui";
import { slots, slotLabels } from "../state/faceData";
import type { MockPhoto, PhotoSlot } from "../state/types";
const guidance = {
  front: ["正脸", "平视镜头，将面部对齐虚线。"],
  left: ["左侧脸", "轻轻向右转头，露出左侧脸部轮廓。"],
  right: ["右侧脸", "轻轻向左转头，露出右侧脸部轮廓。"],
};
export function CapturePhoto({ slot, photo, onBack, onCapture }: {
  slot: PhotoSlot;
  photo: MockPhoto;
  onBack: () => void;
  onCapture: (photo: MockPhoto) => void;
}) {
  const submitted = useRef(false);
  const index = slots.indexOf(slot);
  return (
    <div className="screen capture-screen" data-screen-label="相机拍照">
      <Top title="拍摄三张照片" onBack={onBack} />
      <div className="capture-steps" aria-label="拍摄进度">
        {slots.map((item, i) => (
          <span key={item} className={item === slot ? "active" : ""} aria-current={item === slot ? "step" : undefined}>
            {i < index ? <Check size={13} /> : <i>{i + 1}</i>}
            {slotLabels[item]}
          </span>
        ))}
      </div>
      <div className="capture-instructions" aria-live="polite">
        <h1>拍摄{guidance[slot][0]}</h1>
        <p>{guidance[slot][1]}</p>
      </div>
      <div className="capture-preview">
        <img src={photo.image} alt={`${slotLabels[slot]}取景预览`} />
        <div className="capture-angle-prompt">
          {slot === "right" && <MoveLeft size={18} />}
          <strong>{slot === "front" ? "保持正脸，对齐虚线" : slot === "left" ? "向右转头，拍左侧脸" : "向左转头，拍右侧脸"}</strong>
          {slot === "left" && <MoveRight size={18} />}
        </div>
        <div className={`capture-guide ${slot}`} aria-hidden="true">
          <i className="face-axis vertical" />
          <i className="face-axis horizontal" />
        </div>
        <span>模拟取景 · 演示照片</span>
      </div>
      <div className="capture-controls">
        <button className="primary" aria-label={`拍摄${slotLabels[slot]}照片`} onClick={() => {
          if (submitted.current) return;
          submitted.current = true;
          onCapture(photo);
        }}><Camera size={20} />拍照</button>
      </div>
      <p className="capture-footnote">第 {index + 1} / 3 张 · {index < 2 ? "拍完自动添加，继续下一角度" : "拍完自动添加，完成三图拍摄"}</p>
    </div>
  );
}
