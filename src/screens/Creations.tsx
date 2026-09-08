import { Images, Settings } from "lucide-react";
import type { Creation } from "../state/types";
export function Creations({
  creations,
  onSettings,
  onExplore,
  onOpen,
}: {
  creations: Creation[];
  onSettings: () => void;
  onExplore: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="screen creations" data-screen-label="作品">
      <header className="page-title">
        <span>收藏每一个心动造型</span>
        <h1>作品</h1>
        <button className="settings-button" aria-label="设置" onClick={onSettings}><Settings size={22} /></button>
      </header>
      {creations.length ? (
        <div className="creation-grid">
          {creations.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpen(item.id)}
              aria-label={`${item.templateName}, ${item.aiProfileName}`}
            >
              <img src={item.image} alt={item.templateName} />
              <span>
                <strong>{item.templateName}</strong>
                <small>{item.aiProfileName}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div>
            <Images />
          </div>
          <h2>还没有作品</h2>
          <p>
            从发型、发色或艺术照中选择喜欢的风格，
            <br />
            生成并保存你的第一张作品。
          </p>
          <button className="primary" onClick={onExplore}>
            发现
          </button>
        </div>
      )}
    </div>
  );
}
