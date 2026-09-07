import { Camera, Check, ChevronRight, Images, Trash2, X } from "lucide-react";
import { photos } from "../state/faceData";

export function Sheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="overlay"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet">
        <div className="grabber"></div>
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
    <Sheet onClose={onClose}>
      <div className="action-sheet-title">
        <h2>Add Photo</h2>
        <p>Choose how you want to add your photo.</p>
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
  onPick: (p: string) => void;
  selected: string | null;
}) {
  return (
    <Sheet onClose={onClose}>
      <div className="picker-head">
        <h2>Photo Library</h2>
        <button aria-label="Close" onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="photo-grid">
        {photos.map((p, i) => (
          <button
            className={selected === p ? "selected" : ""}
            key={p}
            onClick={() => onPick(p)}
          >
            <img src={p} alt={`Portrait ${i + 1}`} />
            {selected === p && (
              <span>
                <Check size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
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
    <Sheet onClose={onClose}>
      <div className="sheet-icon danger-icon">
        <Trash2 />
      </div>
      <h2>Delete this creation?</h2>
      <p>This will remove it from My Creations.</p>
      <button className="danger filled" onClick={onDelete}>
        Delete
      </button>
      <button className="plain" onClick={onClose}>
        Cancel
      </button>
    </Sheet>
  );
}
