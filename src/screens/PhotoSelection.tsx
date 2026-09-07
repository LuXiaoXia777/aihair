import { Check, ChevronRight, Plus } from "lucide-react";
import { photos } from "../state/faceData";
import { Top } from "../components/ui";

export function PhotoSelection({
  selected,
  onBack,
  onAdd,
  onContinue,
}: {
  selected: string | null;
  onBack: () => void;
  onAdd: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="screen photo-selection" data-screen-label="Photo Selection">
      <Top title="Add Your Photo" onBack={onBack} />
      <section className="photo-guidance">
        <div className="good-example">
          <img src={photos[0]} alt="Clear front-facing photo example" />
          <span>
            <Check size={13} /> Good photo
          </span>
        </div>
        <h1>
          Use a clear front-facing photo
          <br />
          for the best result.
        </h1>
        <div className="bad-examples">
          <div>
            <span className="bad-photo covered">
              <img src={photos[4]} alt="Face covered example" />
              <i></i>
            </span>
            <small>Face covered</small>
          </div>
          <div>
            <span className="bad-photo side">
              <img src={photos[3]} alt="Side profile example" />
            </span>
            <small>Side profile</small>
          </div>
          <div>
            <span className="bad-photo multiple">
              <img src={photos[1]} alt="Multiple people example" />
              <img src={photos[5]} alt="Second person" />
            </span>
            <small>Multiple people</small>
          </div>
        </div>
      </section>
      <section className="your-photo">
        <div>
          <span>YOUR PHOTO</span>
          <h2>{selected ? "Ready to continue" : "Add one photo"}</h2>
        </div>
        <div className="photo-selection-row">
          <button className="add-photo-tile" onClick={onAdd}>
            <Plus />
            <strong>Add Photo</strong>
          </button>
          {selected && (
            <div className="selected-photo">
              <img src={selected} alt="Selected photo" />
              <span>
                <Check size={14} />
              </span>
            </div>
          )}
        </div>
      </section>
      <div className="continue-dock">
        <button className="primary" disabled={!selected} onClick={onContinue}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
