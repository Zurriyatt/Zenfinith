import { Sparkles, Target, Heart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">About Zenfinith</h1>
        <p className="text-lg text-textPrimary/60 max-w-2xl mx-auto">
          We are on a mission to bring carefully curated products that blend quality, style, and purpose.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <Target className="w-8 h-8 text-active mb-4" />
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Our Mission</h2>
          <p className="text-textPrimary/60">
            To simplify online shopping by offering only products we truly believe in.
          </p>
        </div>
        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <Sparkles className="w-8 h-8 text-active mb-4" />
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Our Vision</h2>
          <p className="text-textPrimary/60">
            To become the most trusted e-commerce brand for modern living.
          </p>
        </div>
        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <Heart className="w-8 h-8 text-active mb-4" />
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Our Values</h2>
          <p className="text-textPrimary/60">
            Integrity, customer obsession, and continuous improvement.
          </p>
        </div>
      </div>

      <div className="bg-bgSecondary border border-border rounded-3xl p-8 md:p-12 text-center">
        <ShieldCheck className="w-10 h-10 text-active mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-textPrimary mb-3">Why Shop With Us?</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-8 text-left">
          <div>
            <h3 className="font-semibold text-textPrimary mb-1">Premium Quality</h3>
            <p className="text-sm text-textPrimary/50">Handpicked products from trusted suppliers.</p>
          </div>
          <div>
            <h3 className="font-semibold text-textPrimary mb-1">Fair Prices</h3>
            <p className="text-sm text-textPrimary/50">Honest pricing without compromising quality.</p>
          </div>
          <div>
            <h3 className="font-semibold text-textPrimary mb-1">Fast Delivery</h3>
            <p className="text-sm text-textPrimary/50">Quick and reliable shipping across Pakistan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}