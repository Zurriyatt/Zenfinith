"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2, Ticket, Percent, DollarSign, Package } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  validFrom: Date | null;
  validUntil: Date | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  productIds: string[];
}

export default function AdminCouponsClient({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("1");
  const [validUntil, setValidUntil] = useState("");
  const [productIdsInput, setProductIdsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productIds = productIdsInput
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          type,
          value: parseFloat(value),
          minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
          usageLimit: usageLimit ? parseInt(usageLimit) : null,
          validUntil: validUntil ? new Date(validUntil).toISOString() : null,
          productIds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Coupon created!");
        router.refresh();
        setCode("");
        setValue("");
        setProductIdsInput("");
        setValidUntil("");
      } else {
        toast.error(data.error || "Failed to create coupon");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-textPrimary">Manage Coupons</h1>

      {/* Create Coupon Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bgSecondary p-6 rounded-2xl border border-border shadow-sm mb-12"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Coupon Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. WELCOME10"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "PERCENTAGE" | "FIXED")}
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          >
            <option className = "bg-bgSecondary" value="PERCENTAGE">Percentage</option>
            <option className = "bg-bgSecondary" value="FIXED">Fixed Amount</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "PERCENTAGE" ? "10" : "20.00"}
            step="0.01"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Minimum Order Value</label>
          <input
            type="number"
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
            placeholder="0"
            step="0.01"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Max Discount</label>
          <input
            type="number"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            placeholder="No limit"
            step="0.01"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Usage Limit</label>
          <input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="1"
            min="1"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Valid Until</label>
          <input
            type="datetime-local"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">
            Product IDs (comma-separated, empty = all products)
          </label>
          <input
            type="text"
            value={productIdsInput}
            onChange={(e) => setProductIdsInput(e.target.value)}
            placeholder="e.g. abc123, def456"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Coupon"}
          </button>
        </div>
      </form>

      {/* Coupons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-textPrimary mb-4">Existing Coupons</h2>
        {initialCoupons.length === 0 ? (
          <p className="text-textPrimary/50">No coupons created yet.</p>
        ) : (
          initialCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between p-4 rounded-xl bg-bgSecondary border border-border"
            >
              <div className="flex items-center gap-3">
                {coupon.type === "PERCENTAGE" ? (
                  <Percent className="w-5 h-5 text-active" />
                ) : (
                  <DollarSign className="w-5 h-5 text-active" />
                )}
                <div>
                  <p className="font-semibold text-textPrimary">{coupon.code}</p>
                  <p className="text-sm text-textPrimary/50">
                    {coupon.type === "PERCENTAGE"
                      ? `${coupon.value}% off`
                      : `$${coupon.value} off`}
                    {coupon.usageLimit && ` · ${coupon.usedCount}/${coupon.usageLimit} used`}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  coupon.isActive
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}