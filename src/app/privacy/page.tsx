import { ShieldCheck, Lock, FileText, Eye } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <ShieldCheck className="w-12 h-12 text-active mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">Privacy Policy</h1>
        <p className="text-textPrimary/60">Last updated: September 4, 2026</p>
      </div>

      <div className="space-y-8">
        <section className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">What We Collect</h2>
          </div>
          <p className="text-textPrimary/70 leading-relaxed">
            We collect information you provide directly (name, email, shipping address) and automatically (device info, cookies, usage data) to improve your experience.
          </p>
        </section>

        <section className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">How We Use Your Data</h2>
          </div>
          <ul className="list-disc list-inside text-textPrimary/70 space-y-2">
            <li>Process and deliver orders</li>
            <li>Send order confirmations and updates</li>
            <li>Improve our products and services</li>
            <li>Prevent fraud and enhance security</li>
          </ul>
        </section>

        <section className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">Sharing Your Information</h2>
          </div>
          <p className="text-textPrimary/70 leading-relaxed">
            We do not sell your personal data. We may share it only with trusted third parties (courier services, payment processors) necessary to fulfill your order.
          </p>
        </section>

        <section className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">Your Rights</h2>
          </div>
          <p className="text-textPrimary/70 leading-relaxed">
            You can request access, correction, or deletion of your personal data at any time by contacting us at support@zenfinith.com.
          </p>
        </section>
      </div>
    </div>
  );
}