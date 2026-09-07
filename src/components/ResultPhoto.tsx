import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export function ResultPhoto({
  original,
  result,
}: {
  original: string;
  result: string;
}) {
  const [showOriginal, setShowOriginal] = useState(false);
  return (
    <div className="result-photo">
      <img
        src={showOriginal ? original : result}
        alt={showOriginal ? "Original photo" : "Generated look"}
      />
      <button
        className="original-toggle"
        aria-pressed={showOriginal}
        onClick={() => setShowOriginal((value) => !value)}
      >
        <ImageIcon size={16} />
        {showOriginal ? "View Result" : "View Original"}
      </button>
    </div>
  );
}
