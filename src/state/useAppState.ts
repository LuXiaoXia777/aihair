import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Creation,
  FaceAnalysisStatus,
  FaceShape,
  MeFilter,
  Screen,
} from "./types";
import { faceShapes, photos } from "./faceData";

// A pending mock operation belongs to the current screen and is cancelled on navigation.
export function useAppState() {
  const [stack, setStack] = useState<Screen[]>([{ kind: "explore" }]);
  const screen = stack[stack.length - 1];
  const [sheet, setSheet] = useState<
    "photo-action" | "picker" | "delete" | null
  >(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState("");
  const [creations, setCreations] = useState<Creation[]>([]);
  const [meFilter, setMeFilter] = useState<MeFilter>("All");
  const [faceAnalysisPhoto, setFaceAnalysisPhoto] = useState<string | null>(
    null,
  );
  const [faceShape, setFaceShape] = useState<FaceShape | null>(null);
  const [faceAnalysisStatus, setFaceAnalysisStatus] =
    useState<FaceAnalysisStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextCreationId = useRef(0);
  const cancelTimer = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => cancelTimer, [cancelTimer]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timeout);
  }, [toast]);

  const leave = () => {
    cancelTimer();
    setGenerating(false);
    setSheet(null);
    setFaceAnalysisStatus((status) =>
      status === "analyzing" ? "idle" : status,
    );
  };
  const push = (target: Screen) => {
    leave();
    setStack((value) => [...value, target]);
  };
  const replace = (target: Screen) => {
    leave();
    setStack((value) => [...value.slice(0, -1), target]);
  };
  const back = () => {
    leave();
    setStack((value) => (value.length > 1 ? value.slice(0, -1) : value));
  };
  const home = (kind: "explore" | "me") => {
    leave();
    setStack([{ kind }]);
  };
  const notify = (message: string) => setToast(message);

  const start = (lookId: string, photo: string) => {
    cancelTimer();
    setSelectedPhoto(photo);
    setSheet(null);
    setGenerating(true);
    const result: Creation = {
      id: ++nextCreationId.current,
      lookId,
      photo,
      createdAt: Date.now(),
    };
    timer.current = setTimeout(() => {
      timer.current = null;
      setGenerating(false);
      setStack((value) => [...value, { kind: "result", result }]);
    }, 1250);
  };
  const startAnalysis = (photo: string) => {
    cancelTimer();
    setFaceAnalysisPhoto(photo);
    setSelectedPhoto(photo);
    setFaceShape(null);
    setFaceAnalysisStatus("analyzing");
    setSheet(null);
    timer.current = setTimeout(() => {
      timer.current = null;
      const index = Math.max(0, photos.indexOf(photo));
      setFaceShape(faceShapes[index % faceShapes.length]);
      setFaceAnalysisStatus("result");
    }, 1250);
  };
  const continuePhoto = (
    target: Extract<Screen, { kind: "photo-selection" }>,
  ) => {
    if (!selectedPhoto) return;
    setStack((value) => value.slice(0, -1));
    if (target.source === "face") startAnalysis(selectedPhoto);
    else if (target.lookId) start(target.lookId, selectedPhoto);
  };
  const save = (result: Creation) => {
    if (creations.some((creation) => creation.id === result.id)) return;
    setCreations((value) =>
      value.some((creation) => creation.id === result.id)
        ? value
        : [result, ...value],
    );
    notify("Saved to My Creations");
  };
  const remove = (id: number) => {
    setCreations((value) => value.filter((creation) => creation.id !== id));
    home("me");
    notify("Creation deleted");
  };
  return {
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
  };
}
