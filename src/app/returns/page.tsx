import { RefreshCcw, Clock, ShieldCheck, MessageCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-textPrimary mb-2">Returns & Refunds</h1>
      <p className="text-textPrimary/60 mb-10">We want you to love your purchase, but if something isn't right, we're here to help.</p>

      <div className="space-y-8">
        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">30-Day Return Policy</h2>
          </div>
          <p className="text-textPrimary/70 leading-relaxed">
            You have 30 days from the date of delivery to request a return. Items must be unworn, unwashed, and in their original packaging with tags attached.
          </p>
        </div>

        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-6 h-6 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">How to Return</h2>
          </div>
          <ol className="list-decimal list-inside text-textPrimary/70 space-y-2">
            <li>Contact us via email or WhatsApp with your order number.</li>
            <li>We'll provide a return address and instructions.</li>
            <li>Ship the item back using any courier of your choice.</li>
            <li>Once we receive and inspect it, we'll process your refund within 5-7 business days.</li>
          </ol>
        </div>

        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-active" />
            <h2 className="text-xl font-semibold text-textPrimary">Refund Method</h2>
          </div>
          <p className="text-textPrimary/70 leading-relaxed">
            Refunds are issued to the original payment method. Cash on delivery orders will be refunded via bank transfer.
          </p>
        </div>
      </div>

      <a href="https://wa.me/923296623549?text=Hello%2C%20I%20need%20help%20with%20a%20return" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
        <MessageCircle className="w-5 h-5" />
        Request a Return
      </a>
    </div>
  );
}