import { faceLabels } from "../state/faceData";
import { useEffect, useRef, type ReactNode } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  Images,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { mockPhotos, poorPhoto } from "../state/faceData";
import type { AIProfile, MockPhoto } from "../state/types";
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
export function PhotoActionSheet({
  onClose,
  onLibrary,
  onCamera,
}: {
  onClose: () => void;
  onLibrary: () => void;
  onCamera: () => void;
}) {
  return (
    <Sheet title="添加照片" onClose={onClose}>
      <div className="action-sheet-title">
        <h2>添加照片</h2>
      </div>
      <div className="system-actions">
        <button onClick={onLibrary}>
          <span>
            <Images />
          </span>
          <strong>从相册选择</strong>
          <ChevronRight />
        </button>
        <button onClick={onCamera}>
          <span>
            <Camera />
          </span>
          <strong>相机拍照</strong>
          <ChevronRight />
        </button>
      </div>
      <button className="plain action-cancel" onClick={onClose}>
        取消
      </button>
    </Sheet>
  );
}
export function Picker({
  onClose,
  onPick,
  selected,
}: {
  onClose: () => void;
  onPick: (photo: MockPhoto) => void;
  selected: MockPhoto | null;
}) {
  return (
    <Sheet title="从相册选择" onClose={onClose}>
      <div className="picker-head">
        <h2>从相册选择</h2>
        <button aria-label="关闭" onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="photo-grid">
        {mockPhotos.map((photo) => (
          <button
            className={selected?.id === photo.id ? "selected" : ""}
            key={photo.id}
            onClick={() => onPick(photo)}
            aria-label={photo.name}
            aria-pressed={selected?.id === photo.id}
          >
            <img src={photo.image} alt={photo.name} />
            {selected?.id === photo.id && (
              <span>
                <Check size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="poor-example">
        <button onClick={() => onPick(poorPhoto)} aria-label="模糊照片">
          <img
            src={poorPhoto.image}
            className="blurred-sample"
            alt="模糊照片"
          />
          <span>
            模糊照片<small>低清晰度示例</small>
          </span>
          <ChevronRight size={16} />
        </button>
      </div>
    </Sheet>
  );
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
