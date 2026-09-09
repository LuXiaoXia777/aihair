import { ChevronRight } from "lucide-react";
import { byId, exploreSections, type LookType } from "../data";
import { mockPhotos } from "../state/faceData";
import { LookCard } from "../components/ui";
export function Explore({
  onCreate,
  onLook,
  onAll,
}: {
  onCreate: () => void;
  onLook: (id: string) => void;
  onAll: (type: LookType, category: string) => void;
}) {
  return (
    <div className="screen explore" data-screen-label="发现">
      <section className="discovery-banner" aria-label="创建专属模特">
      <img className="banner-portrait" src={mockPhotos[0].image} alt="" />
      <div className="banner-shade" />
      <header className="brand-head">
        <div>
          <h1>发型灵感</h1>
        </div>
      </header>
      <div className="discovery-banner-copy">
        <h2>发现属于你的<br />新造型</h2>
        <p>三张照片<br />开启你的专属模特</p>
        <button className="create-model-banner" onClick={onCreate}>创建我的模特 <ChevronRight size={16} /></button>
      </div>
      </section>
      {exploreSections.map((section) => (
          <section
            className="rail-section"
            key={section.title}
            aria-label={section.title}
          >
            <div className="section-head">
              <div>
                <h2>{section.title}</h2>
              </div>
              <button
                onClick={() => onAll(section.type, section.category)}
                aria-label={`查看全部${section.title}`}
              >
                查看全部 <ChevronRight size={15} />
              </button>
            </div>
            <div className="look-rail">
              {section.ids.map((id) => (
                <LookCard key={id} look={byId(id)} onClick={() => onLook(id)} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
