import { Download, Trash2 } from "lucide-react";
import { typeLabel } from "../data";
import type { Creation } from "../state/types";
import { Top } from "../components/ui";
export function CreationDetail({
  creation,
  onBack,
  onDownload,
  onRegenerate,
  onDelete,
}: {
  creation: Creation;
  onBack: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="screen creation-detail" data-screen-label="Creation Detail">
      <Top onBack={onBack} />
      <img
        className="creation-hero"
        src={creation.image}
        alt={creation.templateName}
      />
      <div className="creation-copy">
        <span>{typeLabel(creation.type)}</span>
        <h1>{creation.templateName}</h1>
        <p className="creation-owner">{creation.aiProfileName}</p>
        <div className="creation-actions">
          <button className="primary" onClick={onDownload}>
            <Download size={18} />
            下载图片
          </button>
          <button className="secondary" onClick={onRegenerate}>
            重新生成
          </button>
          <button className="danger" onClick={onDelete}>
            <Trash2 size={18} />
            删除作品
          </button>
        </div>
      </div>
    </div>
  );
}
