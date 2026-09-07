import {
  Image as ImageIcon,
  ScanFace,
  SunMedium,
  UserRound,
} from "lucide-react";
import { byId } from "../data";
import type { FaceAnalysisStatus, FaceShape } from "../state/types";
import { faceDescriptions } from "../state/faceData";
import { FaceLineArt, LookCard, Top } from "../components/ui";

export function FaceAnalysis({
  status,
  photo,
  shape,
  recommendations,
  onBack,
  onChoose,
  onLook,
}: {
  status: FaceAnalysisStatus;
  photo: string | null;
  shape: FaceShape | null;
  recommendations: string[];
  onBack: () => void;
  onChoose: () => void;
  onLook: (id: string) => void;
}) {
  if (status === "analyzing" && photo)
    return (
      <div
        className="screen face-analysis analyzing"
        data-screen-label="Face Shape Analyzing"
      >
        <Top title="Face Shape Analysis" onBack={onBack} />
        <div className="analysis-photo">
          <img src={photo} alt="Photo being analyzed" />
          <span className="scan-line"></span>
          <i>
            <ScanFace />
          </i>
        </div>
        <div className="analysis-progress">
          <div className="loader small">
            <span></span>
            <ScanFace size={25} />
          </div>
          <h1>Analyzing your face shape...</h1>
          <p>Finding the best hairstyles for you.</p>
        </div>
      </div>
    );
  if (status === "result" && photo && shape)
    return (
      <div
        className="screen face-analysis face-result"
        data-screen-label="Face Shape Result"
      >
        <Top onBack={onBack} />
        <div className="face-result-hero">
          <img src={photo} alt="Analyzed face" />
          <span>YOUR FACE SHAPE</span>
        </div>
        <div className="shape-copy">
          <small>Your Face Shape</small>
          <h1>{shape}</h1>
          <p>{faceDescriptions[shape]}</p>
        </div>
        <section className="recommendations">
          <div className="recommendation-head">
            <span>CHOSEN FOR {shape.toUpperCase()}</span>
            <h2>Recommended For You</h2>
          </div>
          <div className="library-grid">
            {recommendations.map((id) => (
              <LookCard
                grid
                key={id}
                look={byId(id)}
                onClick={() => onLook(id)}
              />
            ))}
          </div>
        </section>
        <button className="secondary analyze-again" onClick={onChoose}>
          Analyze Another Photo
        </button>
      </div>
    );
  return (
    <div
      className="screen face-analysis"
      data-screen-label="Face Shape Analysis"
    >
      <Top title="Face Shape Analysis" onBack={onBack} />
      <div className="face-guide">
        <div className="guide-orbit">
          <FaceLineArt />
          <span></span>
        </div>
      </div>
      <div className="face-intro">
        <span>PERSONALIZED STYLE</span>
        <h1>
          Find the styles
          <br />
          that suit you best.
        </h1>
        <p>For the best result, use a clear front-facing photo.</p>
        <button className="primary" onClick={onChoose}>
          <ImageIcon size={18} /> Choose a Photo
        </button>
      </div>
      <div className="photo-tips">
        <div>
          <ScanFace />
          <span>
            Face the
            <br />
            camera
          </span>
        </div>
        <div>
          <UserRound />
          <span>
            Keep your face
            <br />
            visible
          </span>
        </div>
        <div>
          <SunMedium />
          <span>
            Use good
            <br />
            lighting
          </span>
        </div>
      </div>
    </div>
  );
}
