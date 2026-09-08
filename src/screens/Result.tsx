import { byId, similarLooks } from "../data";
import type { Creation } from "../state/types";
import { LookCard, Top, UsingAI } from "../components/ui";
export function Result({
  result,
  saved,
  onBack,
  onSave,
  onRegenerate,
  onMore,
}: {
  result: Creation;
  saved: boolean;
  onBack: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  onMore: (id: string) => void;
}) {
  const look = byId(result.templateId);
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
          <button
            className={`primary ${saved ? "saved" : ""}`}
            onClick={onSave}
          >
            {saved ? "已保存 ✓" : "保存到作品"}
          </button>
          <button className="secondary" onClick={onRegenerate}>
            重新生成
          </button>
        </div>
      </div>
      <section className="similar">
        <h2>试试其他风格</h2>
        <div className="look-rail">
          {similarLooks(look).map((item) => (
            <LookCard
              key={item.id}
              look={item}
              onClick={() => onMore(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
