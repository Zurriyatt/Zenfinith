"use client";

import { useState, useEffect } from "react";
import { Monitor, Smartphone, Laptop, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Device {
  id: string;
  fingerprint: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  lastUsedAt: string;
  createdAt: string;
  expiresAt: string;
}

export default function ActiveDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/active-devices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDevices(data.devices);
        else toast.error(data.error || "Failed to load devices");
      })
      .catch(() => toast.error("An error occurred"))
      .finally(() => setLoading(false));
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke access for this device?")) return;
    setRevokingId(id);
    try {
      const res = await fetch(`/api/user/active-devices/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDevices((prev) => prev.filter((d) => d.id !== id));
        toast.success("Device revoked");
      } else {
        toast.error(data.error || "Failed to revoke");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-textPrimary/50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-active" />
        <h3 className="text-xl font-semibold text-textPrimary">Active Devices</h3>
      </div>

      {devices.length === 0 ? (
        <p className="text-textPrimary/50">No active devices found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-bgSecondary border border-border rounded-2xl p-4 flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-textPrimary/70" />
                  <span className="font-medium text-textPrimary">Device</span>
                </div>
                <button
                  onClick={() => handleRevoke(device.id)}
                  disabled={revokingId === device.id}
                  className="p-1.5 rounded-lg text-textPrimary/40 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  aria-label="Revoke device"
                >
                  {revokingId === device.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-textPrimary/50 truncate mb-1">
                {device.userAgent || "Unknown device"}
              </p>
              {device.ipAddress && (
                <p className="text-xs text-textPrimary/50">IP: {device.ipAddress}</p>
              )}
              <p className="text-xs text-textPrimary/40 mt-auto">
                Last active: {new Date(device.lastUsedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}