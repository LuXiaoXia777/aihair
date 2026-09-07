import { byId } from "./data";
import { photos, faceRecommendations } from "./state/faceData";
import { useAppState } from "./state/useAppState";
import { BottomNav } from "./components/ui";
import { PhotoActionSheet, Picker, DeleteSheet } from "./components/sheets";
import { Explore } from "./screens/Explore";
import { FaceAnalysis } from "./screens/FaceAnalysis";
import { PhotoSelection } from "./screens/PhotoSelection";
import { Library } from "./screens/Library";
import { Detail } from "./screens/Detail";
import { Result } from "./screens/Result";
import { Me } from "./screens/Me";
import { CreationDetail } from "./screens/CreationDetail";

export function App() {
  const {
    screen,
    sheet,
    setSheet,
    selectedPhoto,
    setSelectedPhoto,
    generating,
    toast,
    creations,
    meFilter,
    setMeFilter,
    faceAnalysisPhoto,
    setFaceAnalysisPhoto,
    faceShape,
    setFaceShape,
    faceAnalysisStatus,
    setFaceAnalysisStatus,
    push,
    replace,
    back,
    home,
    notify,
    start,
    continuePhoto,
    save,
    remove,
  } = useAppState();
  const shellClass =
    screen.kind === "explore" || screen.kind === "me" ? "with-nav" : "";
  return (
    <main className={`app-shell ${shellClass}`}>
      <div className="noise"></div>
      {screen.kind === "explore" && (
        <Explore
          onAnalyze={() => {
            setFaceAnalysisStatus("idle");
            setFaceAnalysisPhoto(null);
            setFaceShape(null);
            push({ kind: "face-analysis" });
          }}
          onLook={(id) => push({ kind: "detail", id })}
          onAll={(type, category) => push({ kind: "library", type, category })}
        />
      )}
      {screen.kind === "face-analysis" && (
        <FaceAnalysis
          status={faceAnalysisStatus}
          photo={faceAnalysisPhoto}
          shape={faceShape}
          recommendations={faceShape ? faceRecommendations[faceShape] : []}
          onBack={back}
          onChoose={() => push({ kind: "photo-selection", source: "face" })}
          onLook={(id) => push({ kind: "detail", id, fromAnalysis: true })}
        />
      )}
      {screen.kind === "photo-selection" && (
        <PhotoSelection
          selected={selectedPhoto}
          onBack={back}
          onAdd={() => setSheet("photo-action")}
          onContinue={() => continuePhoto(screen)}
        />
      )}
      {screen.kind === "library" && (
        <Library
          onCategory={(category) => replace({ ...screen, category })}
          screen={screen}
          onBack={back}
          onLook={(id) => push({ kind: "detail", id })}
        />
      )}
      {screen.kind === "detail" && (
        <Detail
          look={byId(screen.id)}
          generating={generating}
          onBack={back}
          onTry={() =>
            screen.fromAnalysis && faceAnalysisPhoto
              ? start(screen.id, faceAnalysisPhoto)
              : push({
                  kind: "photo-selection",
                  source: "look",
                  lookId: screen.id,
                })
          }
          onSimilar={(id) =>
            replace({ kind: "detail", id, fromAnalysis: screen.fromAnalysis })
          }
        />
      )}
      {screen.kind === "result" && (
        <Result
          look={byId(screen.result.lookId)}
          before={screen.result.photo}
          saved={creations.some((c) => c.id === screen.result.id)}
          onBack={back}
          onSave={() => save(screen.result)}
          onAnother={() => home("explore")}
          onMore={(id) => push({ kind: "detail", id })}
          onDownload={() => notify("Download started")}
        />
      )}
      {screen.kind === "me" && (
        <Me
          creations={creations}
          filter={meFilter}
          onFilter={setMeFilter}
          onExplore={() => home("explore")}
          onOpen={(creationId) => push({ kind: "creation", creationId })}
        />
      )}
      {screen.kind === "creation" && (
        <CreationDetail
          creation={creations.find((c) => c.id === screen.creationId)!}
          onBack={back}
          onDownload={() => notify("Download started")}
          onTry={(id) => push({ kind: "detail", id })}
          onDelete={() => setSheet("delete")}
        />
      )}
      {(screen.kind === "explore" || screen.kind === "me") && (
        <BottomNav active={screen.kind} onGo={home} />
      )}
      {sheet === "photo-action" && screen.kind === "photo-selection" && (
        <PhotoActionSheet
          onClose={() => setSheet(null)}
          onLibrary={() => setSheet("picker")}
          onCamera={() => {
            setSelectedPhoto(photos[2]);
            setSheet(null);
          }}
        />
      )}
      {sheet === "picker" && screen.kind === "photo-selection" && (
        <Picker
          onClose={() => setSheet("photo-action")}
          onPick={(p) => {
            setSelectedPhoto(p);
            setSheet(null);
          }}
          selected={selectedPhoto}
        />
      )}
      {sheet === "delete" && screen.kind === "creation" && (
        <DeleteSheet
          onClose={() => setSheet(null)}
          onDelete={() => remove(screen.creationId)}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}
