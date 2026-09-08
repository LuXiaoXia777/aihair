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
    <Sheet title="Add Photo" onClose={onClose}>
      <div className="action-sheet-title">
        <h2>Add Photo</h2>
      </div>
      <div className="system-actions">
        <button onClick={onLibrary}>
          <span>
            <Images />
          </span>
          <strong>Photo Library</strong>
          <ChevronRight />
        </button>
        <button onClick={onCamera}>
          <span>
            <Camera />
          </span>
          <strong>Camera</strong>
          <ChevronRight />
        </button>
      </div>
      <button className="plain action-cancel" onClick={onClose}>
        Cancel
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
    <Sheet title="Photo Library" onClose={onClose}>
      <div className="picker-head">
        <h2>Photo Library</h2>
        <button aria-label="Close" onClick={onClose}>
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
        <button onClick={() => onPick(poorPhoto)} aria-label="Blurry photo">
          <img
            src={poorPhoto.image}
            className="blurred-sample"
            alt="Blurry photo"
          />
          <span>
            Blurry photo<small>Low quality example</small>
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
    <Sheet title="Choose Your AI" onClose={onClose}>
      <div className="picker-head">
        <h2>Choose Your AI</h2>
        <button aria-label="Close" onClick={onClose}>
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
              <small>{profile.faceShape ?? "Ready to use"}</small>
            </span>
            {profile.id === selectedId && <Check size={18} />}
          </button>
        ))}
      </div>
      <button className="secondary" onClick={onNew}>
        <Plus size={18} />
        Create New AI
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
    <Sheet title="Delete this creation?" onClose={onClose}>
      <div className="sheet-icon danger-icon">
        <Trash2 />
      </div>
      <h2>Delete this creation?</h2>
      <p>This will remove it from Creations.</p>
      <button className="danger filled" onClick={onDelete}>
        Delete
      </button>
      <button className="plain" onClick={onClose}>
        Cancel
      </button>
    </Sheet>
  );
}
