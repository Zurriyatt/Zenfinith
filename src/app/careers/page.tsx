import { Rocket, Heart, Code, ArrowRight, Sparkles, Mail } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
export default function FounderPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-active/10 text-active text-sm font-semibold px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-4 h-4" />
                    Solo Founder & Developer
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
                    Hey, I'm the person behind Zenfinith
                </h1>
                <p className="text-lg text-textPrimary/60 max-w-2xl mx-auto">
                    No big team, no corporate office—just one passionate developer building something meaningful from
                    scratch.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-bgSecondary border border-border rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-textPrimary mb-4">My Story</h2>
                    <p className="text-textPrimary/70 leading-relaxed mb-4">
                        I started Zenfinith with a simple belief: online shopping should feel personal, trustworthy, and
                        beautifully designed. What began as a personal project evolved into a full e-commerce platform
                        with authentication, payments, recommendations, and more.
                    </p>
                    <p className="text-textPrimary/70 leading-relaxed">
                        I handle everything—frontend, backend, design, security, and customer support. That means every
                        detail you see has been crafted with care.
                    </p>
                </div>

                <div className="bg-bgSecondary border border-border rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-textPrimary mb-4">Why a Solo Founder?</h2>
                    <p className="text-textPrimary/70 leading-relaxed mb-4">
                        Being a one-person team gives me complete control over quality and direction. No bureaucracy, no
                        compromises—just pure focus on creating the best experience for you.
                    </p>
                    <p className="text-textPrimary/70 leading-relaxed">
                        Every feature you see—from 2FA authentication to AI recommendations—was built by me, with the
                        help of modern tools and a relentless desire to learn.
                    </p>
                </div>
            </div>

            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-textPrimary mb-3">What Drives Me</h2>
                <p className="text-textPrimary/60 max-w-xl mx-auto">Three principles guide every decision I make.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-16">
                <div className="bg-bgSecondary border border-border rounded-2xl p-6 text-center">
                    <Rocket className="w-8 h-8 text-active mx-auto mb-4" />
                    <h3 className="font-semibold text-textPrimary mb-2">Build Fast</h3>
                    <p className="text-sm text-textPrimary/50">Ship features quickly, learn from feedback, iterate.</p>
                </div>
                <div className="bg-bgSecondary border border-border rounded-2xl p-6 text-center">
                    <Heart className="w-8 h-8 text-active mx-auto mb-4" />
                    <h3 className="font-semibold text-textPrimary mb-2">Care Deeply</h3>
                    <p className="text-sm text-textPrimary/50">
                        Every user matters. Every bug gets fixed. Every email gets answered.
                    </p>
                </div>
                <div className="bg-bgSecondary border border-border rounded-2xl p-6 text-center">
                    <Code className="w-8 h-8 text-active mx-auto mb-4" />
                    <h3 className="font-semibold text-textPrimary mb-2">Stay Curious</h3>
                    <p className="text-sm text-textPrimary/50">
                        Always learning new technologies to make Zenfinith better.
                    </p>
                </div>
            </div>

            <div className="bg-active/5 border border-active/20 rounded-3xl p-8 text-center">
                <h2 className="text-2xl font-bold text-textPrimary mb-4">Let's Connect</h2>
                <p className="text-textPrimary/60 mb-6">I'd love to hear your feedback, ideas, or just say hi.</p>
                <div className="flex justify-center gap-4">
                    <a
                        href="mailto:support@zenfinith.com"
                        className="p-3 rounded-xl bg-bgSecondary border border-border hover:shadow-lg transition-all"
                    >
                        <Mail className="w-5 h-5 text-active" />
                    </a>
                    <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-bgSecondary border border-border hover:shadow-lg transition-all"
                    >
                        <SiGithub className="w-5 h-5 text-active" />
                    </a>
                </div>
            </div>
        </div>
    );
}
