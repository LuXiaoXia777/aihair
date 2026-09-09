import { Download } from "lucide-react";
import type { Creation } from "../state/types";
import { Top, UsingAI } from "../components/ui";
export function Result({
  result,
  onBack,
  onDownload,
  onRegenerate,
}: {
  result: Creation;
  onBack: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="screen result" data-screen-label="Result">
      <Top onBack={onBack} />
      <img
        className="result-image"
        src={result.image}
        alt={`${result.templateName}效果`}
      />
      <div className="result-copy">
        <span>你的新造型</span>
        <h1>{result.templateName}</h1>
        <UsingAI
          profile={{
            name: result.aiProfileName,
            avatar: result.aiProfileAvatar,
          }}
        />
        <div className="result-actions">
          <button className="primary" onClick={onDownload}>
            <Download size={18} />
            下载图片
          </button>
          <button className="secondary" onClick={onRegenerate}>
            重新生成
          </button>
        </div>
      </div>
    </div>
  );
}
