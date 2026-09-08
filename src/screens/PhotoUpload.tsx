import { useEffect, useRef, useState } from "react";
import { Images, Plus, X } from "lucide-react";
import { Top } from "../components/ui";
import type { MockPhoto } from "../state/types";

export function PhotoUpload({photos, onAdd, onRemove, onBack, onGenerate, validating}: {
  photos: MockPhoto[]; onAdd: (photos: MockPhoto[]) => void; onRemove: (id: string) => void;
  onBack: () => void; onGenerate: () => void; validating: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  const readers = useRef(new Set<FileReader>());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; for (const reader of readers.current) reader.abort(); };
  }, []);
  const readFiles = async (files: File[]) => {
    if (!files.length) return;
    setLoading(true); setError("");
    const results = await Promise.allSettled(files.map(file => new Promise<MockPhoto>((resolve, reject) => {
      if (!file.type.startsWith("image/")) { reject(new Error(file.name)); return; }
      const reader = new FileReader();
      readers.current.add(reader);
      reader.onerror = reader.onabort = () => { readers.current.delete(reader); reject(new Error(file.name)); };
      reader.onload = () => {
        readers.current.delete(reader);
        const image = new Image();
        image.onload = () => resolve({id: `file-${file.name}-${file.size}-${file.lastModified}`, name: file.name, image: String(reader.result), quality: "good"});
        image.onerror = () => reject(new Error(file.name));
        image.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    })));
    if (!alive.current) return;
    const valid = results.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
    onAdd(valid);
    if (valid.length < files.length) setError("部分文件无法读取，请选择可正常打开的照片（如 JPG、PNG 或 WebP）。");
    setLoading(false);
  };
  return <div className="screen photo-upload-screen" data-screen-label="照片上传">
    <Top title="选择照片" onBack={onBack} />
    <div className="setup-copy"><span className="eyebrow">创建你的专属模特</span><h1>准备至少 3 张照片</h1><p>选择同一个人的清晰单人照，建议包含正脸、左侧脸和右侧脸。</p></div>
    <input ref={input} className="local-photo-input" type="file" accept="image/*" multiple aria-label="本地相册" onChange={event => {
      const files = Array.from(event.target.files ?? []); event.target.value = ""; void readFiles(files);
    }} />
    <button className="upload-large" disabled={loading || validating} onClick={() => input.current?.click()}>
      <Images size={34} /><strong>{loading ? "正在读取照片…" : "打开本地相册"}</strong><span>支持一次多选，也可以继续添加</span>
    </button>
    <p className="upload-count" role="status">已选择 {photos.length} 张{photos.length < 3 ? `，还需 ${3 - photos.length} 张` : "，可以开始生成"}</p>
    {error && <p className="upload-error" role="alert">{error}</p>}
    <div className="uploaded-grid">
      {photos.map((photo, index) => <div key={photo.id}><img src={photo.image} alt={`已选照片 ${index + 1}`} /><button aria-label={`移除照片 ${index + 1}`} disabled={validating || loading} onClick={() => onRemove(photo.id)}><X size={16} /></button></div>)}
      {photos.length > 0 && <button className="add-more" aria-label="继续添加照片" disabled={loading || validating} onClick={() => input.current?.click()}><Plus /></button>}
    </div>
    <section className="quality-guide"><h2>照片上传说明</h2><p>• 至少 3 张不同照片，多角度更完整。<br />• 光线充足、面部无遮挡，避免滤镜和多人合照。<br />• 照片仅在当前页面内读取，生成流程为原型演示。</p></section>
    <div className="continue-dock"><button className="primary" onClick={onGenerate} disabled={photos.length < 3 || loading || validating}>{validating ? "正在检查照片…" : "生成我的模特"}</button></div>
  </div>;
}
