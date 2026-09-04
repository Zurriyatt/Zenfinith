"use client";

import React, { ChangeEvent, useState } from "react";
import { Search, Filter, Package, Loader2, MapPin, CreditCard } from "lucide-react";
import { ArrowUpDownIcon } from "lucide-react";
import { useMemo } from "react";
import Image from "next/image";

interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
}

interface Order {
    id: string;
    user: {
        name: string;
        email: string;
    };
    email: string;
    status: string;
    subtotal: number;
    discount: number;
    total: number;
    couponCode: string | null;
    address: string;
    city: string | null;
    phone: string | null;
    country: string | null;
    createdAt: string;
    items: OrderItem[];
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currFil, setCurrFill] = useState<string | null>(null);
    const [priceS, setPriceS] = useState("highToLow");
    const [createdS, setCreatedS] = useState("descend");
    const [totalItemsS, setTotalItemsS] = useState("moreToLess");
    // Filter placeholder logic – you'll implement actual filtering later
    const filteredAndSortedOrders = useMemo(() => {
        const result = orders.filter((order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()));
      if(currFil === "priceS"){
        if (priceS === "highToLow") {
            result.sort((a, b) => b.total - a.total);
        } else if (priceS === "lowToHigh") {
            result.sort((a, b) => a.total - b.total);
        }}else if(currFil === "createdS"){

        if (createdS === "ascend") {
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
}else{
        if (totalItemsS === "moreToLess") {
            result.sort((a, b) => b.items.length - a.items.length);
        } else {
            result.sort((a, b) => a.items.length - b.items.length);
        }}
        return result;
    }, [orders, searchTerm, priceS, createdS, totalItemsS]);

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const name = e.target.name;
        setCurrFill(name);
        if (name === "priceS") {
            setPriceS(value);
        } else if (name === "createdS") {
            setCreatedS(value);
        } else {
            setTotalItemsS(value);
        }
    };
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-textPrimary">Orders</h1>

            {/* Toolbar / Filter Placeholder */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textPrimary/40" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by order ID..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-bgSecondary text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                    />
                </div>

                <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-bgSecondary text-textPrimary/80 hover:text-textPrimary transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Filter Panel Placeholder */}
            {filterOpen && (
                <>
                    <div className="bg-bgSecondary border border-border rounded-xl p-4 mb-6 text-textPrimary/80 text-sm flex flex-col  px-5">
                        <h5 className="text-2xl font-bold text-textPrimary self-start mb-3 mx-1 flex justify-center items-center">
                            Sorting Order <ArrowUpDownIcon />
                        </h5>
                        <div className="flex gap-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="createdAs" className="text-sm font-medium text-textSecondary">
                                    CreatedAT
                                </label>
                                <select
                                    name="createdS"
                                    value={createdS}
                                    onChange={handleSelectChange}
                                    id="createdAt"
                                    className="border focus:ring-4 focus:ring-active/40 border-active/5 bg-bgPrimary hover:border-active/90 hover:text-textPrimary transition-all p-2 rounded-lg hover:cursor-pointer text-lg font-medium font-sans duration-200 ease-in"
                                >
                                    <option value="ascend">Ascend</option>
                                    <option value="descend">Descend</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="price-select" className="text-sm font-medium text-textSecondary">
                                    Price
                                </label>
                                <select
                                    name="priceS"
                                    value={priceS}
                                    onChange={handleSelectChange}
                                    id="price-select"
                                    className="border focus:ring-4 focus:ring-active/40 border-active/5 bg-bgPrimary hover:border-active/90 hover:text-textPrimary transition-all p-2 rounded-lg hover:cursor-pointer text-lg font-medium font-sans duration-200 ease-in"
                                >
                                    <option value="highToLow">High to Low</option>
                                    <option value="lowToHigh">Low to High</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="items-select" className="text-sm font-medium text-textSecondary">
                                    Items
                                </label>
                                <select
                                    name="totalItemS"
                                    value={totalItemsS}
                                    onChange={handleSelectChange}
                                    id="items-select"
                                    className="border focus:ring-4 focus:ring-active/40 border-active/5 bg-bgPrimary hover:border-active/90 hover:text-textPrimary transition-all p-2 rounded-lg hover:cursor-pointer text-lg font-medium font-sans duration-200 ease-in"
                                >
                                    <option value="moreToLess">More to Less</option>
                                    <option value="lessToMore">Less to More</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Orders List */}
            {filteredAndSortedOrders.length === 0 ? (
                <div className="py-20 text-center text-textPrimary/40">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAndSortedOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-bgSecondary border border-border rounded-2xl p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-textPrimary/50">Order ID</p>
                                    <p className="font-mono text-textPrimary">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-textPrimary/50">Customer</p>
                                    <p className="text-textPrimary font-medium">{order.user.name}</p>
                                    <p className="text-xs text-textPrimary/40">{order.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-textPrimary/50">Total</p>
                                    <p className="font-bold text-textPrimary">${order.total.toFixed(2)}</p>
                                    {order.discount > 0 && (
                                        <p className="text-xs text-green-600">-${order.discount.toFixed(2)}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                            order.status === "PAID"
                                                ? "bg-green-500/10 text-green-600"
                                                : order.status === "PENDING"
                                                  ? "bg-yellow-500/10 text-yellow-600"
                                                  : "bg-red-500/10 text-red-500"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-sm text-textPrimary/50">
                                    <p className="flex items-center gap-1">
                                        <CreditCard className="w-4 h-4" />
                                        {order.items.length} items
                                    </p>
                                    <p className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Items preview (optional) */}
                            <div className="mt-4 flex gap-3 overflow-x-auto">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2 min-w-40 bg-bgPrimary/5 rounded-lg p-2"
                                    >
                                        {item.image ? (
                                            <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <Package className="w-10 h-10 text-textPrimary/30" />
                                        )}
                                        <div className="text-xs">
                                            <p className="font-medium text-textPrimary truncate">{item.name}</p>
                                            <p className="text-textPrimary/50">
                                                ${item.price.toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
