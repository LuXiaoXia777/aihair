import { useLayoutEffect, useRef } from "react";
import { byId } from "./data";
import { useAppState } from "./state/useAppState";
import { mockPhotos } from "./state/faceData";
import { CapturePhoto } from "./screens/CapturePhoto";
import { BottomNav } from "./components/ui";
import {
  DeleteSheet,
  DeleteProfileSheet,
  CreateSourceSheet,
  SwitchSheet,
} from "./components/sheets";
import { Explore } from "./screens/Explore";
import { MyAI } from "./screens/MyAI";
import { Library } from "./screens/Library";
import { Detail } from "./screens/Detail";
import { Result } from "./screens/Result";
import { SettingsScreen, Agreement } from "./screens/Settings";
import { Creations } from "./screens/Creations";
import { CreationDetail } from "./screens/CreationDetail";
import {
  CreatingAI,
  Generating,
} from "./screens/CreateAI";
import { PhotoUpload } from "./screens/PhotoUpload";
export function App() {
  const state = useAppState();
  const {
    screen,
    sheet,
    currentAIProfile: current,
    aiProfiles,
    push,
    replace,
    home,
    back,
    beginCreate,
    setSheet,
    useProfile,
  } = state;
  const root =
    screen.kind === "explore" ||
    screen.kind === "my-ai" ||
    screen.kind === "creations";
  const openLook = (id: string) => push({ kind: "detail", id });
  const findProfile = (id: string) =>
    aiProfiles.find((profile) => profile.id === id)!;
  const viewport = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef(new WeakMap<object, number>());
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    element.scrollTop = scrollPositions.current.get(screen) ?? 0;
    return () => { scrollPositions.current.set(screen, element.scrollTop); };
  }, [screen]);
  return (
    <main className={`app-shell ${root ? "with-nav" : ""}`}>
      <div className="noise" />
      <div className="app-viewport" ref={viewport} inert={sheet ? true : undefined}>
      {screen.kind === "explore" && (
        <Explore
          onCreate={() => beginCreate("explore")}
          onLook={openLook}
          onAll={(type, category) => push({ kind: "library", type, category })}
        />
      )}
      {screen.kind === "my-ai" && (
        <MyAI
          profile={current}
          profiles={aiProfiles}
          onCreate={() => beginCreate("my-ai")}
          onSwitch={() => setSheet({ kind: "switch" })}
          onSelect={(profile) => useProfile(profile)}
          onLook={openLook}
          onDelete={() =>
            current && setSheet({ kind: "delete-profile", profileId: current.id })
          }
        />
      )}
      {screen.kind === "creations" && (
        <Creations
          creations={state.creations}
          onSettings={() => push({ kind: "settings" })}
          onExplore={() => home("explore")}
          onOpen={(creationId) => push({ kind: "creation", creationId })}
        />
      )}
      {screen.kind === "settings" && (
        <SettingsScreen onBack={back} onAgreement={(agreement) => push({kind: "agreement", agreement})} />
      )}
      {screen.kind === "agreement" && (
        <Agreement kind={screen.agreement} onBack={back} />
      )}
      {screen.kind === "library" && (
        <Library
          screen={screen}
          onBack={back}
          onLook={openLook}
          onCategory={(category) => replace({ ...screen, category })}
        />
      )}
      {screen.kind === "detail" && (
        <Detail
          look={byId(screen.id)}
          profile={current}
          onBack={back}
          onGenerate={() => state.generate(screen.id)}
          onSimilar={(id) => replace({ kind: "detail", id })}
        />
      )}
      {screen.kind === "generating" && (
        <Generating result={screen.result} onBack={back} />
      )}
      {screen.kind === "result" && (
        <Result
          result={screen.result}
          onBack={back}
          onDownload={() => state.notify("下载演示已完成")}
          onRegenerate={() => state.generate(screen.result.templateId, true)}
        />
      )}
      {screen.kind === "creation" && (
        <CreationDetail
          creation={state.creations.find(
            (creation) => creation.id === screen.creationId,
          )!}
          onBack={back}
          onDownload={() => state.notify("下载演示已完成")}
          onRegenerate={() =>
            openLook(
              state.creations.find(
                (creation) => creation.id === screen.creationId,
              )!.templateId,
            )
          }
          onDelete={() =>
            setSheet({ kind: "delete", creationId: screen.creationId })
          }
        />
      )}
      {(screen.kind === "photo-upload" || (screen.kind === "validating" && screen.source === "photos")) && (
        <PhotoUpload photos={state.uploadedPhotos} onAdd={state.addUploads} onRemove={state.removeUpload} onBack={back} onGenerate={state.validatePhotos} validating={screen.kind === "validating"} />
      )}
      {(screen.kind === "camera" || (screen.kind === "validating" && screen.source === "camera")) && (
        <CapturePhoto key={screen.kind === "camera" ? screen.slot ?? "complete" : "complete"} slot={screen.kind === "camera" ? screen.slot : null} draft={state.draft} photo={mockPhotos[2]} onBack={back} onCapture={state.capturePhoto} onRetake={state.retakePhoto} onGenerate={state.validatePhotos} validating={screen.kind === "validating"} />
      )}
      {screen.kind === "creating-ai" && (
        <CreatingAI avatar={screen.profile.avatar} onBack={back} />
      )}
      </div>
      {root && (
        <BottomNav
          active={screen.kind as "explore" | "my-ai" | "creations"}
          onGo={home}
        />
      )}
      {sheet?.kind === "switch" && (
        <SwitchSheet
          profiles={aiProfiles}
          selectedId={current?.id}
          onSelect={(profile) => useProfile(profile)}
          onNew={() => beginCreate()}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet?.kind === "create-source" && (
        <CreateSourceSheet onClose={() => setSheet(null)} onCamera={() => state.chooseSource("camera")} onPhotos={() => state.chooseSource("photos")} templateName={state.setupTemplateId ? byId(state.setupTemplateId).name : undefined} />
      )}
      {sheet?.kind === "delete" && (
        <DeleteSheet
          onClose={() => setSheet(null)}
          onDelete={() => state.remove(sheet.creationId)}
        />
      )}
      {sheet?.kind === "delete-profile" && (() => {
        const profile = findProfile(sheet.profileId);
        return profile ? (
          <DeleteProfileSheet
            profileName={profile.name}
            onClose={() => setSheet(null)}
            onDelete={() => state.removeProfile(profile.id)}
          />
        ) : null;
      })()}
      {state.toast && (
        <div className="toast" role="status">
          {state.toast}
        </div>
      )}
    </main>
  );
}
