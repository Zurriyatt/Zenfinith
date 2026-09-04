import { MessageCircle, Mail, ChevronDown, ShieldCheck, Package, CreditCard, RefreshCcw } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-textPrimary mb-2">Help Center</h1>
      <p className="text-textPrimary/60 mb-10">How can we help you today?</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        <a href="/returns" className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
          <RefreshCcw className="w-6 h-6 text-active" />
          <div>
            <h2 className="font-semibold text-textPrimary">Returns & Refunds</h2>
            <p className="text-sm text-textPrimary/50">30-day easy returns</p>
          </div>
        </a>
        <a href="/shipping" className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
          <Package className="w-6 h-6 text-active" />
          <div>
            <h2 className="font-semibold text-textPrimary">Shipping</h2>
            <p className="text-sm text-textPrimary/50">Delivery times & costs</p>
          </div>
        </a>
        <a href="/contact" className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
          <MessageCircle className="w-6 h-6 text-active" />
          <div>
            <h2 className="font-semibold text-textPrimary">Contact Us</h2>
            <p className="text-sm text-textPrimary/50">We're here to help</p>
          </div>
        </a>
        <div className="flex items-center gap-4 bg-bgSecondary border border-border rounded-2xl p-5">
          <ShieldCheck className="w-6 h-6 text-active" />
          <div>
            <h2 className="font-semibold text-textPrimary">Secure Payments</h2>
            <p className="text-sm text-textPrimary/50">Powered by Stripe</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-textPrimary mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        <details className="bg-bgSecondary border border-border rounded-xl p-4 group">
          <summary className="flex justify-between items-center cursor-pointer font-medium text-textPrimary">
            How do I track my order?
            <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-textPrimary/60 text-sm">You'll receive an email with tracking details once your order ships. You can also reach us via WhatsApp for updates.</p>
        </details>
        <details className="bg-bgSecondary border border-border rounded-xl p-4 group">
          <summary className="flex justify-between items-center cursor-pointer font-medium text-textPrimary">
            Can I change my shipping address after ordering?
            <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-textPrimary/60 text-sm">Please contact us within 24 hours of placing the order. After dispatch, address changes may not be possible.</p>
        </details>
        <details className="bg-bgSecondary border border-border rounded-xl p-4 group">
          <summary className="flex justify-between items-center cursor-pointer font-medium text-textPrimary">
            What payment methods do you accept?
            <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-textPrimary/60 text-sm">We accept all major credit/debit cards via Stripe, as well as bank transfer and cash on delivery for select areas.</p>
        </details>
      </div>

      <div className="mt-10 flex items-center gap-3 text-textPrimary/70">
        <Mail className="w-5 h-5" />
        <span>Need more help? Email us at <a href="mailto:support@zenfinith.com" className="text-active hover:underline">support@zenfinith.com</a></span>
      </div>
    </div>
  );
}