import { useLayoutEffect, useRef } from "react";
import { byId } from "./data";
import { useAppState } from "./state/useAppState";
import { mockPhotos, slots } from "./state/faceData";
import { CapturePhoto } from "./screens/CapturePhoto";
import { BottomNav } from "./components/ui";
import {
  DeleteSheet,
  PhotoActionSheet,
  Picker,
  SwitchSheet,
} from "./components/sheets";
import { Explore } from "./screens/Explore";
import { MyAI } from "./screens/MyAI";
import { Library } from "./screens/Library";
import { Detail } from "./screens/Detail";
import { Result } from "./screens/Result";
import { Creations } from "./screens/Creations";
import { CreationDetail } from "./screens/CreationDetail";
import {
  AIReady,
  AnalyzingAI,
  CreateIntro,
  CreatingAI,
  Generating,
  ProfilePhotos,
} from "./screens/CreateAI";
import { FaceResult } from "./screens/FaceResult";
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
          profile={current}
          hasProfiles={aiProfiles.length > 0}
          onCreate={() => beginCreate("explore")}
          onSwitch={() => setSheet({ kind: "switch" })}
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
          onSelect={(profile) => useProfile(profile, "my-ai")}
          onLook={openLook}
          onRecommendations={() =>
            current &&
            push({
              kind: "face-result",
              profileId: current.id,
              returnTo: "my-ai",
            })
          }
        />
      )}
      {screen.kind === "creations" && (
        <Creations
          creations={state.creations}
          filter={state.filter}
          onFilter={state.setFilter}
          onExplore={() => home("explore")}
          onOpen={(creationId) => push({ kind: "creation", creationId })}
        />
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
          saved={state.creations.some(
            (creation) => creation.id === screen.result.id,
          )}
          onBack={back}
          onSave={() => state.save(screen.result)}
          onRegenerate={() => state.generate(screen.result.templateId, true)}
          onMore={openLook}
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
      {screen.kind === "create-intro" && (
        <CreateIntro
          onBack={back}
          onStart={() =>
            push({ kind: "profile-photos", returnTo: screen.returnTo })
          }
        />
      )}
      {(screen.kind === "profile-photos" || screen.kind === "validating") && (
        <ProfilePhotos
          draft={state.draft}
          errors={state.photoErrors}
          validating={screen.kind === "validating"}
          onBack={back}
          onAdd={(slot) => setSheet({ kind: "photo-action", slot })}
          onCamera={() => push({ kind: "camera", slot: "front", mode: "all" })}
          onContinue={state.validatePhotos}
        />
      )}
      {screen.kind === "camera" && (
        <CapturePhoto
          key={`${screen.mode}-${screen.slot}`}
          slot={screen.slot}
          mode={screen.mode}
          photo={
            state.draft.front?.quality === "good"
              ? state.draft.front
              : mockPhotos[2]
          }
          onBack={back}
          onUse={(photo) => {
            state.pickPhoto(screen.slot, photo);
            const next = slots[slots.indexOf(screen.slot) + 1];
            if (screen.mode === "all" && next)
              replace({ ...screen, slot: next });
            else back();
          }}
        />
      )}
      {screen.kind === "creating-ai" && (
        <CreatingAI avatar={screen.profile.avatar} onBack={back} />
      )}
      {screen.kind === "ai-ready" && (
        <AIReady
          profile={findProfile(screen.profileId)}
          onBack={back}
          onUse={() =>
            useProfile(findProfile(screen.profileId), screen.returnTo)
          }
          onAnother={() => beginCreate(screen.returnTo, true)}
        />
      )}
      {screen.kind === "analyzing-ai" && (
        <AnalyzingAI profile={findProfile(screen.profileId)} onBack={back} />
      )}
      {screen.kind === "face-result" && (
        <FaceResult
          profile={findProfile(screen.profileId)}
          returnTo={screen.returnTo}
          onBack={back}
          onDone={() => home(screen.returnTo)}
          onLook={openLook}
        />
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
      {sheet?.kind === "photo-action" && screen.kind === "profile-photos" && (
        <PhotoActionSheet
          onClose={() => setSheet(null)}
          onLibrary={() => setSheet({ kind: "picker", slot: sheet.slot })}
          onCamera={() =>
            push({ kind: "camera", slot: sheet.slot, mode: "single" })
          }
        />
      )}
      {sheet?.kind === "picker" && screen.kind === "profile-photos" && (
        <Picker
          selected={state.draft[sheet.slot]}
          onPick={(photo) => state.pickPhoto(sheet.slot, photo)}
          onClose={() => setSheet({ kind: "photo-action", slot: sheet.slot })}
        />
      )}
      {sheet?.kind === "delete" && (
        <DeleteSheet
          onClose={() => setSheet(null)}
          onDelete={() => state.remove(sheet.creationId)}
        />
      )}
      {state.toast && (
        <div className="toast" role="status">
          {state.toast}
        </div>
      )}
    </main>
  );
}
