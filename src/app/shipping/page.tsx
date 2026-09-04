import { Package, Truck, MapPin, CreditCard, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-textPrimary mb-2">Shipping Information</h1>
      <p className="text-textPrimary/60 mb-10">We deliver across Pakistan through trusted courier partners.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <Truck className="w-6 h-6 text-active mb-3" />
          <h2 className="font-semibold text-textPrimary mb-1">Standard Delivery</h2>
          <p className="text-sm text-textPrimary/50">2-4 business days</p>
          <p className="text-lg font-bold text-textPrimary mt-2">Rs. 200</p>
          <p className="text-xs text-textPrimary/40">Free on orders over Rs. 5,000</p>
        </div>
        <div className="bg-bgSecondary border border-border rounded-2xl p-6">
          <Clock className="w-6 h-6 text-active mb-3" />
          <h2 className="font-semibold text-textPrimary mb-1">Express Delivery</h2>
          <p className="text-sm text-textPrimary/50">1-2 business days</p>
          <p className="text-lg font-bold text-textPrimary mt-2">Rs. 400</p>
          <p className="text-xs text-textPrimary/40">Available in major cities</p>
        </div>
      </div>

      <div className="bg-bgSecondary border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-active" />
          <h2 className="text-xl font-semibold text-textPrimary">Courier Partners</h2>
        </div>
        <ul className="space-y-2 text-textPrimary/70">
          <li>• Leopard Courier</li>
          <li>• TCS</li>
          <li>• Call Courier</li>
        </ul>
        <p className="text-sm text-textPrimary/50 mt-4">Tracking numbers are provided via email once the order is dispatched.</p>
      </div>

      <div className="mt-8 bg-bgSecondary border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-active" />
          <h2 className="text-xl font-semibold text-textPrimary">Cash on Delivery</h2>
        </div>
        <p className="text-textPrimary/70">Available for selected cities. A small handling fee may apply.</p>
      </div>
    </div>
  );
}