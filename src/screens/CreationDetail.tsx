import { Download, Trash2 } from "lucide-react";
import { byId } from "../data";
import type { Creation } from "../state/types";
import { Top } from "../components/ui";

export function CreationDetail({
  creation,
  onBack,
  onDownload,
  onTry,
  onDelete,
}: {
  creation: Creation;
  onBack: () => void;
  onDownload: () => void;
  onTry: (id: string) => void;
  onDelete: () => void;
}) {
  const look = byId(creation.lookId);
  return (
    <div className="screen creation-detail" data-screen-label="Creation Detail">
      <Top onBack={onBack} />
      <img className="creation-hero" src={look.image} alt={look.name} />
      <div className="creation-copy">
        <span>{look.type === "color" ? "Hair Color" : "Hairstyle"}</span>
        <h1>{look.name}</h1>
        <div className="creation-actions">
          <button className="primary" onClick={onDownload}>
            <Download size={18} /> Download
          </button>
          <button className="secondary" onClick={() => onTry(look.id)}>
            Try Again
          </button>
          <button className="danger" onClick={onDelete}>
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
