"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff, Lock, KeyRound, ShieldCheck, MessageSquareWarning } from "lucide-react";
import { toast } from "sonner";

type ChangePasswordInputs = {
  currentPassword: string;
  newPassword: string;
  retypeNewPassword: string;
};

export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordInputs>();

  const newPassword = watch("newPassword");

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(`${result.error}` || "Failed to change password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-bgSecondary/50 dark:bg-[#0a0a0a]/50 border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-active/10 border border-active/30 text-active mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-textPrimary">Change Password</h2>
        <p className="text-sm text-textPrimary/60 mt-2">
          Update your password to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className={`w-full p-2.5 rounded-xl border-2 outline-none bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30
                ${errors.currentPassword ? "border-red-500/60" : "border-textPrimary/10 hover:border-textPrimary/30 focus:border-active"}
                focus:ring-4 focus:ring-active/10 transition-all duration-300 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textPrimary/40 hover:text-active transition-colors"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="text-red-500 text-xs flex items-center gap-1">
              <MessageSquareWarning className="w-3.5 h-3.5" />
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80 flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`w-full p-2.5 rounded-xl border-2 outline-none bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30
                ${errors.newPassword ? "border-red-500/60" : "border-textPrimary/10 hover:border-textPrimary/30 focus:border-active"}
                focus:ring-4 focus:ring-active/10 transition-all duration-300 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textPrimary/40 hover:text-active transition-colors"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-red-500 text-xs flex items-center gap-1">
              <MessageSquareWarning className="w-3.5 h-3.5" />
              {errors.newPassword.message}
            </span>
          )}
        </div>

        {/* Retype New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textPrimary/80 flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Retype New Password
          </label>
          <div className="relative">
            <input
              type={showRetype ? "text" : "password"}
              placeholder="Retype new password"
              {...register("retypeNewPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className={`w-full p-2.5 rounded-xl border-2 outline-none bg-bgPrimary/5 text-textPrimary placeholder:text-textPrimary/30
                ${errors.retypeNewPassword ? "border-red-500/60" : "border-textPrimary/10 hover:border-textPrimary/30 focus:border-active"}
                focus:ring-4 focus:ring-active/10 transition-all duration-300 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowRetype(!showRetype)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textPrimary/40 hover:text-active transition-colors"
            >
              {showRetype ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.retypeNewPassword && (
            <span className="text-red-500 text-xs flex items-center gap-1">
              <MessageSquareWarning className="w-3.5 h-3.5" />
              {errors.retypeNewPassword.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
            ${loading ? "bg-active/50 cursor-not-allowed" : "bg-active hover:bg-active/90 active:scale-[0.98] cursor-pointer  "}
          `}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}