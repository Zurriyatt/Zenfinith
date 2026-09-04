import { Mail, MessageCircle, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-textPrimary mb-2">Contact Us</h1>
      <p className="text-textPrimary/60 mb-10">Have a question or just want to say hello? We'd love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <a href="mailto:zurriyat.dev@proton.me" className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
            <Mail className="w-6 h-6 text-active" />
            <div>
              <h2 className="font-semibold text-textPrimary">Email</h2>
              <p className="text-sm text-textPrimary/50">zurriyat.dev@proton.me</p>
            </div>
          </a>
          <a href="https://wa.me/923296623549?text=Hello%20Zenfinith!" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
            <MessageCircle className="w-6 h-6 text-active" />
            <div>
              <h2 className="font-semibold text-textPrimary">WhatsApp</h2>
              <p className="text-sm text-textPrimary/50">+92 329 6623549</p>
            </div>
          </a>
          <div className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5">
            <Clock className="w-6 h-6 text-active" />
            <div>
              <h2 className="font-semibold text-textPrimary">Business Hours</h2>
              <p className="text-sm text-textPrimary/50">Mon - Sat, 10am - 7pm</p>
            </div>
          </div>
        </div>

        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Send a Message</h2>
          <p className="text-sm text-textPrimary/50 mb-6">We'll get back to you within 24 hours.</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-3 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-3 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full p-3 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
            />
            <button className="w-full py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}