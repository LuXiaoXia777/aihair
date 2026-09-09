import { useEffect, useRef, useState } from "react";
import { byId } from "../data";
import {
  analyzeProfile,
  emptyDraft,
  faceRecommendations,
  profileNames,
  slots,
} from "./faceData";
import type {
  ActiveSheet,
  AIProfile,
  Creation,
  MockPhoto,
  PhotoDraft,
  PhotoSlot,
  RootTab,
  Screen,
  SetupSource,
} from "./types";

export function useAppState() {
  const [stack, setStack] = useState<Screen[]>([{ kind: "explore" }]);
  const screen = stack[stack.length - 1];
  const [sheet, setSheet] = useState<ActiveSheet>(null);
  const [aiProfiles, setAIProfiles] = useState<AIProfile[]>([]);
  const [currentAIProfileId, setCurrentAIProfileId] = useState<string | null>(
    null,
  );
  const currentAIProfile =
    aiProfiles.find((profile) => profile.id === currentAIProfileId) ?? null;
  const [draft, setDraft] = useState<PhotoDraft>(emptyDraft);
  const [uploadedPhotos, setUploadedPhotos] = useState<MockPhoto[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [toast, setToast] = useState("");
  const nextId = useRef(0);
  const nextProfileNumber = useRef(0);
  const operationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelOperation = () => {
    if (operationTimer.current !== null) clearTimeout(operationTimer.current);
    operationTimer.current = null;
  };
  const closeTransient = () => {
    cancelOperation();
    setSheet(null);
  };
  const push = (target: Screen) => {
    closeTransient();
    setStack((value) => [...value, target]);
  };
  const replace = (target: Screen) => {
    closeTransient();
    setStack((value) => [...value.slice(0, -1), target]);
  };
  const home = (kind: RootTab) => {
    closeTransient();
    setStack([{ kind }]);
  };
  const back = () => {
    closeTransient();
    if (screen.kind === "validating" || screen.kind === "creating-ai") {
      setStack((value) => [
        ...value.slice(0, -1),
        screen.source === "camera" ? { kind: "camera", slot: null, returnTo: screen.returnTo } : { kind: "photo-upload", returnTo: screen.returnTo },
      ]);
    } else setStack((value) => (value.length > 1 ? value.slice(0, -1) : value));
  };
  const setupTemplate = [...stack].reverse().find((entry) => entry.kind === "detail");
  const finishSetup = () => {
    if (screen.kind !== "face-result") return;
    if (stack[stack.length - 2]?.kind === "detail") back();
    else home(screen.returnTo);
  };
  const rootTab = (): RootTab => {
    const kind = stack[0].kind;
    return kind === "my-ai" || kind === "creations" ? kind : "explore";
  };
  const beginCreate = (
    returnTo: RootTab = rootTab(),
  ) => {
    closeTransient();
    setDraft(emptyDraft());
    setUploadedPhotos([]);
    setSheet({ kind: "create-source", returnTo });
  };
  const chooseSource = (source: SetupSource) => {
    if (sheet?.kind !== "create-source") return;
    if (source === "camera") push({kind: "camera", slot: "front", returnTo: sheet.returnTo});
    else push({kind: "photo-upload", returnTo: sheet.returnTo});
  };
  const capturePhoto = (photo: MockPhoto) => {
    if (screen.kind !== "camera" || !screen.slot) return;
    const slot = screen.slot;
    setDraft(value => ({...value, [slot]: photo}));
    const next = slots[slots.indexOf(slot) + 1];
    replace({...screen, slot: next ?? null});
  };
  const addUploads = (photos: MockPhoto[]) => setUploadedPhotos(value => [...new Map([...value, ...photos].map(photo => [photo.id, photo])).values()]);
  const removeUpload = (id: string) => setUploadedPhotos(value => value.filter(photo => photo.id !== id));
  const validatePhotos = () => {
    if (screen.kind !== "photo-upload" && screen.kind !== "camera") return;
    const source: SetupSource = screen.kind === "camera" ? "camera" : "photos";
    const photos = source === "camera" ? slots.map(slot => draft[slot]).filter((p): p is MockPhoto => p !== null) : uploadedPhotos;
    if (photos.length < 3) return;
    replace({kind: "validating", returnTo: screen.returnTo, source, photos});
  };
  const useProfile = (profile: AIProfile) => {
    setCurrentAIProfileId(profile.id);
    setSheet(null);
  };
  const generate = (templateId: string, regenerate = false) => {
    if (!currentAIProfile) {
      beginCreate(rootTab());
      return;
    }
    const look = byId(templateId);
    const result: Creation = {
      id: `creation-${++nextId.current}`,
      type: look.type,
      templateId: look.id,
      templateName: look.name,
      image: look.image,
      createdAt: Date.now(),
      aiProfileId: currentAIProfile.id,
      aiProfileName: currentAIProfile.name,
      aiProfileAvatar: currentAIProfile.avatar,
    };
    if (regenerate) replace({ kind: "generating", result });
    else push({ kind: "generating", result });
  };
  const save = (result: Creation) => {
    if (creations.some((creation) => creation.id === result.id)) return;
    setCreations((value) =>
      value.some((creation) => creation.id === result.id)
        ? value
        : [result, ...value],
    );
    setToast("已保存到作品");
  };
  const remove = (id: string) => {
    setCreations((value) => value.filter((creation) => creation.id !== id));
    home("creations");
    setToast("作品已删除");
  };
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);
  // Every async mock is owned by one exact stack entry. Navigation cancels it immediately;
  // the effect cleanup also handles component unmount and React StrictMode.
  useEffect(() => {
    const finish = (target: Screen) =>
      setStack((value) =>
        value[value.length - 1] === screen
          ? [...value.slice(0, -1), target]
          : value,
      );
    if (screen.kind === "generating") {
      operationTimer.current = setTimeout(
        () => finish({ kind: "result", result: screen.result }),
        1250,
      );
    } else if (screen.kind === "validating") {
      operationTimer.current = setTimeout(() => {
        const index = nextProfileNumber.current++;
        const profile: AIProfile = {
          id: `ai-${++nextId.current}`,
          name:
            profileNames[index % profileNames.length] +
            (index >= profileNames.length
              ? ` ${Math.floor(index / profileNames.length) + 1}`
              : ""),
          avatar: screen.photos[0].image,
          photos: { front: screen.photos[0], left: screen.photos[1], right: screen.photos[2] },
          sourcePhotos: screen.photos,
          faceShape: null,
          recommendations: [],
        };
        finish({ kind: "creating-ai", profile, source: screen.source, returnTo: screen.returnTo });
      }, 450);
    } else if (screen.kind === "creating-ai") {
      operationTimer.current = setTimeout(() => {
        const faceShape = analyzeProfile(screen.profile.photos.front);
        const profile = {...screen.profile, faceShape, recommendations: faceRecommendations[faceShape]};
        setAIProfiles(value => value.some(item => item.id === profile.id) ? value : [...value, profile]);
        setCurrentAIProfileId(profile.id);
        finish({kind: "face-result", profileId: profile.id, returnTo: screen.returnTo});
      }, 1250);
    }
    return cancelOperation;
  }, [screen]);
  return {
    screen,
    sheet,
    setSheet,
    aiProfiles,
    currentAIProfile,
    draft,
    uploadedPhotos,
    chooseSource,
    capturePhoto,
    addUploads,
    removeUpload,
    creations,
    toast,
    notify: setToast,
    push,
    replace,
    home,
    back,
    beginCreate,
    validatePhotos,
    useProfile,
    generate,
    setupTemplateId: setupTemplate?.id,
    finishSetup,
    save,
    remove,
  };
}
