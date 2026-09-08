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
  CreationFilter,
  MockPhoto,
  PhotoDraft,
  PhotoSlot,
  RootTab,
  Screen,
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
  const [photoErrors, setPhotoErrors] = useState<PhotoSlot[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [filter, setFilter] = useState<CreationFilter>("全部");
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
        { kind: "profile-photos", returnTo: screen.returnTo },
      ]);
    } else if (screen.kind === "analyzing-ai") {
      setStack((value) => [
        ...value.slice(0, -1),
        {
          kind: "ai-ready",
          returnTo: screen.returnTo,
          profileId: screen.profileId,
        },
      ]);
    } else setStack((value) => (value.length > 1 ? value.slice(0, -1) : value));
  };
  const rootTab = (): RootTab => {
    const kind = stack[0].kind;
    return kind === "my-ai" || kind === "creations" ? kind : "explore";
  };
  const beginCreate = (
    returnTo: RootTab = rootTab(),
    replaceCurrent = false,
  ) => {
    setDraft(emptyDraft());
    setPhotoErrors([]);
    if (replaceCurrent) {
      closeTransient();
      setStack([{ kind: returnTo }, { kind: "create-intro", returnTo }]);
    } else push({ kind: "create-intro", returnTo });
  };
  const pickPhoto = (slot: PhotoSlot, photo: MockPhoto) => {
    setDraft((value) => ({ ...value, [slot]: photo }));
    setPhotoErrors((value) => value.filter((error) => error !== slot));
    setSheet(null);
  };
  const validatePhotos = () => {
    if (screen.kind !== "profile-photos" || !slots.every((slot) => draft[slot]))
      return;
    replace({
      kind: "validating",
      returnTo: screen.returnTo,
      photos: draft as Record<PhotoSlot, MockPhoto>,
    });
  };
  const useProfile = (profile: AIProfile, returnTo: RootTab = rootTab()) => {
    setCurrentAIProfileId(profile.id);
    setSheet(null);
    if (!profile.faceShape) {
      closeTransient();
      setStack([
        { kind: returnTo },
        { kind: "analyzing-ai", profileId: profile.id, returnTo },
      ]);
    }
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
        const errors = slots.filter(
          (slot) => screen.photos[slot].quality === "poor",
        );
        setPhotoErrors(errors);
        if (errors.length) {
          finish({ kind: "profile-photos", returnTo: screen.returnTo });
          return;
        }
        const index = nextProfileNumber.current++;
        const profile: AIProfile = {
          id: `ai-${++nextId.current}`,
          name:
            profileNames[index % profileNames.length] +
            (index >= profileNames.length
              ? ` ${Math.floor(index / profileNames.length) + 1}`
              : ""),
          avatar: screen.photos.front.image,
          photos: screen.photos,
          faceShape: null,
          recommendations: [],
        };
        finish({ kind: "creating-ai", profile, returnTo: screen.returnTo });
      }, 450);
    } else if (screen.kind === "creating-ai") {
      operationTimer.current = setTimeout(() => {
        setAIProfiles((value) =>
          value.some((profile) => profile.id === screen.profile.id)
            ? value
            : [...value, screen.profile],
        );
        finish({
          kind: "ai-ready",
          profileId: screen.profile.id,
          returnTo: screen.returnTo,
        });
      }, 1250);
    } else if (screen.kind === "analyzing-ai") {
      operationTimer.current = setTimeout(() => {
        setAIProfiles((value) =>
          value.map((profile) => {
            if (profile.id !== screen.profileId) return profile;
            const faceShape = analyzeProfile(profile.photos.front);
            return {
              ...profile,
              faceShape,
              recommendations: faceRecommendations[faceShape],
            };
          }),
        );
        finish({
          kind: "face-result",
          profileId: screen.profileId,
          returnTo: screen.returnTo,
        });
      }, 1000);
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
    photoErrors,
    creations,
    filter,
    setFilter,
    toast,
    notify: setToast,
    push,
    replace,
    home,
    back,
    beginCreate,
    pickPhoto,
    validatePhotos,
    useProfile,
    generate,
    save,
    remove,
  };
}
