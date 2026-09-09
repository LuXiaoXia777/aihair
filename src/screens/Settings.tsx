import { ChevronRight, FileText, ShieldCheck } from "lucide-react";
import { Top } from "../components/ui";

type AgreementKind = "privacy" | "terms";
export function SettingsScreen({ onBack, onAgreement }: {
  onBack: () => void;
  onAgreement: (kind: AgreementKind) => void;
}) {
  return <div className="screen settings-screen" data-screen-label="设置">
    <Top title="设置" onBack={onBack} />
    <section className="settings-group" aria-label="协议与说明">
      <button onClick={() => onAgreement("privacy")}><ShieldCheck /><span>隐私协议</span><ChevronRight size={18} /></button>
      <button onClick={() => onAgreement("terms")}><FileText /><span>用户协议</span><ChevronRight size={18} /></button>
    </section>
  </div>;
}
const agreements = {
  privacy: {
    title: "隐私协议",
    sections: [
      ["关于本原型", "发型灵感用于演示浏览模板、创建分身和保存作品的交互。本页为原型说明示例，正式服务的隐私协议需在上线前另行确认。"],
      ["照片与分身", "照片功能仅在你主动选择文件后读取这些照片，用于当前页面预览与模拟创建，不上传到服务器。相机为模拟取景，不调用摄像头。"],
      ["数据保存", "选中的照片、分身和作品仅保存在当前页面的运行状态中。刷新或关闭页面后会清空，作品可在详情页删除。"],
      ["网站访问", "网站通过 GitHub Pages 提供访问。加载网页和图片会向托管服务发起网络请求；托管服务可能按其政策处理访问日志。"],
      ["你的选择", "你可以自由浏览模板，也可以随时取消创建。当前原型不提供账号登录、广告跟踪或向其他用户分享个人数据的功能。"],
    ],
  },
  terms: {
    title: "用户协议",
    sections: [
      ["使用说明", "欢迎体验发型灵感。本页为交互原型的协议示例，用于说明当前演示范围，不代表已上线正式服务的完整条款。"],
      ["功能范围", "你可以浏览发型、发色和艺术照模板，选择本地照片或使用模拟拍摄创建分身，并体验生成、下载和删除作品的流程。"],
      ["效果说明", "分身创建、脸型分析、拍照和生成均为模拟演示。效果图来自预置模板，不是基于你真实身份生成的结果，也不承诺实际造型效果。"],
      ["作品与下载", "作品只在当前页面运行期间保留，刷新后会清空。下载按钮用于演示操作反馈，不会发起真实文件下载。"],
      ["合理使用", "请勿利用本原型冒用他人身份、侵犯他人肖像或其他权益。选择本地照片时，请确保你有权使用这些照片。"],
    ],
  },
};
export function Agreement({ kind, onBack }: {kind: AgreementKind; onBack: () => void}) {
  const agreement = agreements[kind];
  return <div className="screen agreement-screen" data-screen-label={agreement.title}>
    <Top title={agreement.title} onBack={onBack} />
    <article className="agreement-copy">
      <p className="agreement-note">原型说明 · 更新于 2026 年 9 月 8 日</p>
      {agreement.sections.map(([heading, content], index) => <section key={heading}>
        <h2>{index + 1}. {heading}</h2><p>{content}</p>
      </section>)}
    </article>
  </div>;
}
