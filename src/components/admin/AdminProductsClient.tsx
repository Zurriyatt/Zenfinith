"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Trash2, Package, Star } from "lucide-react";
import { Product } from "@/lib/products";

export default function AdminProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [description, setDesc] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("men");
  const [badge, setBadge] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("badge", badge);
    formData.append("totalDiscount", discount || "0"); // optional

    if (imageFiles) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product created!");
        router.refresh();
        // Reset all fields
        setName("");
        setPrice("");
        setDesc("");
        setCategory("men");
        setBadge("");
        setDiscount("");
        setImageFiles(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create product");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted!");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-textPrimary">Manage Products</h1>

      {/* Create Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bgSecondary p-6 rounded-2xl border border-border shadow-sm mb-12"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Minimalist Watch"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Product description"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          >
            <option value="new-arrivals">New Arrivals</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="accessories">Accessories</option>
            <option value="sale">Sale</option>
            <option value="best-products">Best Products</option>
          </select>
        </div> 

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Badge</label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="e.g. New, Sale, Hot"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Discount %</label>
          <input
            type="number"
            value={discount}
            max={100}
            min={0}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0"
            step="0.01"
            className="w-full p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all duration-300"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setImageFiles(files.length ? files : null);
            }}
            className="block w-full text-sm text-textPrimary/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-active file:text-white file:font-semibold hover:file:bg-active/90 transition-colors"
          />
          {imageFiles && (
            <p className="text-xs text-textPrimary/50">{imageFiles.length} file(s) selected</p>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {initialProducts.map((product) => (
          <div
            key={product.id}
            className="bg-bgSecondary rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-52">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-active text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => handleDelete(product.id)}
                className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full transition-colors"
                aria-label="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-textPrimary truncate">{product.name}</h3>
              <p className="text-sm text-textPrimary/60 line-clamp-2 mt-1">
                {product.description || "No description"}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="font-bold text-textPrimary">${product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="text-xs text-textPrimary/50 line-through ml-2">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.totalDiscount > 0 && (
                  <span className="text-xs font-medium text-green-600">
                    -{product.totalDiscount}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mt-2 text-xs text-textPrimary/50">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
                <span>·</span>
                <span>{product.reviewsCount} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}