import { Images } from "lucide-react";
import type { Creation, CreationFilter } from "../state/types";
export function Creations({
  creations,
  filter,
  onFilter,
  onExplore,
  onOpen,
}: {
  creations: Creation[];
  filter: CreationFilter;
  onFilter: (filter: CreationFilter) => void;
  onExplore: () => void;
  onOpen: (id: string) => void;
}) {
  const shown = creations.filter(
    (item) =>
      filter === "全部" ||
      item.type ===
        (
          {
            发型: "hairstyle",
            "发色": "color",
            艺术照: "portrait",
          } as const
        )[filter],
  );
  return (
    <div className="screen creations" data-screen-label="作品">
      <header className="page-title">
        <span>收藏每一个心动造型</span>
        <h1>作品</h1>
      </header>
      <div className="filter-tabs" aria-label="筛选作品">
        {(["全部", "发型", "发色", "艺术照"] as const).map(
          (item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              aria-pressed={filter === item}
              onClick={() => onFilter(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      {shown.length ? (
        <div className="creation-grid">
          {shown.map((item) => (
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
          <h2>{creations.length ? "暂无这类作品" : "还没有作品"}</h2>
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
