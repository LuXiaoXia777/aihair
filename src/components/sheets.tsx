import { faceLabels } from "../state/faceData";
import { useEffect, useRef, type ReactNode } from "react";
import {
  Check,
  Camera,
  Images,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { AIProfile } from "../state/types";
export function Sheet({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === "Tab") {
        const buttons = [
          ...(ref.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          ) ?? []),
        ];
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <div
      className="overlay"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="grabber" />
        {children}
      </div>
    </div>
  );
}
export function CreateSourceSheet({onClose, onCamera, onPhotos, templateName}: {
  onClose: () => void; onCamera: () => void; onPhotos: () => void; templateName?: string;
}) {
  return <Sheet title="创建我的模特" onClose={onClose}>
    <div className="picker-head"><h2>创建我的模特</h2><button aria-label="关闭" onClick={onClose}><X /></button></div>
    <p>{templateName ? `创建后即可应用「${templateName}」，请选择照片来源。` : "选择一种方式，准备你的模特照片。"}</p>
    <div className="source-options">
      <button onClick={onCamera}><Camera /><span><strong>相机</strong><small>依次拍摄正脸、左侧脸、右侧脸</small></span><ChevronRight /></button>
      <button onClick={onPhotos}><Images /><span><strong>照片</strong><small>从本地相册选择至少 3 张照片</small></span><ChevronRight /></button>
    </div>
    <button className="plain" onClick={onClose}>取消</button>
  </Sheet>;
}
export function SwitchSheet({
  profiles,
  selectedId,
  onSelect,
  onNew,
  onClose,
}: {
  profiles: AIProfile[];
  selectedId?: string;
  onSelect: (profile: AIProfile) => void;
  onNew: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="选择分身" onClose={onClose}>
      <div className="picker-head">
        <h2>选择分身</h2>
        <button aria-label="关闭" onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="switch-profiles">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            aria-pressed={profile.id === selectedId}
            onClick={() => onSelect(profile)}
          >
            <img src={profile.avatar} alt="" />
            <span>
              <strong>{profile.name}</strong>
              <small>{profile.faceShape ? faceLabels[profile.faceShape] : "待使用"}</small>
            </span>
            {profile.id === selectedId && <Check size={18} />}
          </button>
        ))}
      </div>
      <button className="secondary" onClick={onNew}>
        <Plus size={18} />
        新建分身
      </button>
    </Sheet>
  );
}
export function DeleteSheet({
  onClose,
  onDelete,
}: {
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Sheet title="确定删除这张作品？" onClose={onClose}>
      <div className="sheet-icon danger-icon">
        <Trash2 />
      </div>
      <h2>确定删除这张作品？</h2>
      <p>删除后无法恢复，其他作品不受影响。</p>
      <button className="danger filled" onClick={onDelete}>
        删除作品
      </button>
      <button className="plain" onClick={onClose}>
        取消
      </button>
    </Sheet>
  );
}
export function DeleteProfileSheet({
  profileName,
  onClose,
  onDelete,
}: {
  profileName: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Sheet title={`确定删除分身${profileName}？`} onClose={onClose}>
      <div className="sheet-icon danger-icon">
        <Trash2 />
      </div>
      <h2>确定删除「{profileName}」？</h2>
      <p>删除后无法恢复，使用该分身创建的作品仍会保留。</p>
      <button className="danger filled" onClick={onDelete}>
        删除分身
      </button>
      <button className="plain" onClick={onClose}>
        取消
      </button>
    </Sheet>
  );
}

const formatProfileCreatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);

export function ProfileDetailSheet({
  profile,
  current,
  onClose,
  onUse,
  onDelete,
}: {
  profile: AIProfile;
  current: boolean;
  onClose: () => void;
  onUse: () => void;
  onDelete: () => void;
}) {
  return (
    <Sheet title="分身详情" onClose={onClose}>
      <div className="picker-head">
        <h2>分身详情</h2>
        <button aria-label="关闭" onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="profile-detail-card">
        <img src={profile.avatar} alt="" />
        <div>
          <strong>{profile.name}</strong>
          <small>{profile.faceShape ? faceLabels[profile.faceShape] : "脸型分析中"}</small>
        </div>
      </div>
      <p className="profile-created-at">创建于 {formatProfileCreatedAt(profile.createdAt)}</p>
      <button className="primary" disabled={current} onClick={onUse}>
        {current ? "当前使用中" : "设为当前分身"}
      </button>
      <button className="danger" onClick={onDelete}>
        <Trash2 size={18} />
        删除分身
      </button>
    </Sheet>
  );
}
