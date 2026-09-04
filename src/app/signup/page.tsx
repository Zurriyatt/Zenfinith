"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  MessageSquareWarning,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
} from "lucide-react";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";

import { toast } from "sonner";
import { useSession, signIn, signOut } from "next-auth/react";
type Inputs = {
  email: string;
  password: string;
  name: string;
};
import { useRouter } from "next/navigation";
export default function SignUpForm(): React.ReactNode {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    if (session?.user) {
      router.replace("/profile");
    }
  }, []);
  const submitChange: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const convertedData = await response.json();

      if (convertedData.success === true) {
        toast.success("✅Account Created!");
        console.log(convertedData.res);
      } else {
        toast.error(`❌${convertedData.error}`);
        console.log(convertedData.error);
      }
    } catch (error) {
      console.error("SignUP failed!");
    }
  };

  return (
    <div className="bg-textPrimary text-bgPrimary shadow-2xl border border-bgPrimary/10 hover:border-bgPrimary/20 transition-all duration-500 px-10 py-4 xl:py-7 rounded-2xl max-w-md w-full">
      <form
        onSubmit={handleSubmit(submitChange)}
        className="w-full flex flex-col justify-center items-center gap-5"
      >
        {/* ✅ Elite Heading with subtle underline */}
        <div className="text-center">
          <h2 className="font-sans text-3xl font-semibold tracking-tight">
            Welcome
          </h2>
          <p className="text-bgPrimary/40 text-sm mt-1 font-light">
            Create Your Account!
          </p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium font-sans text-bgPrimary/80 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            {...register("email", { required: "This field is required" })}
            type="email"
            placeholder="Enter your email"
            className={`
              w-full text-md text-bgPrimary placeholder:text-bgPrimary/30 placeholder:font-light
              p-2 rounded-xl
              outline-none
              border-2 border-bgPrimary/10
              bg-bgPrimary/5
              hover:border-bgPrimary/30
              focus:border-bgPrimary ring-bgPrimary
              focus:ring-3 focus:ring-bgPrimary/50
              focus:bg-bgPrimary/10
              transition-all duration-300 ease-out
            `}
          />
          {errors.email && (
            <span className="text-red-400 font-medium font-sans flex items-center gap-1.5 text-sm animate-pulse">
              <MessageSquareWarning className="w-4 h-4" />
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Name Field */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium font-sans text-bgPrimary/80 flex items-center gap-2">
            <User className="w-4 h-4" />
            Name
          </label>
          <input
            {...register("name", {
              required: "This field is required",
              maxLength: {
                value: 12,
                message: "Max length of name should be 12",
              },
              minLength: {
                value: 3,
                message: "Min length of name should be 3",
              },
            })}
            type="text"
            placeholder="Enter your name"
            className={`
              w-full text-md text-bgPrimary placeholder:text-bgPrimary/30 placeholder:font-light
              p-2 rounded-xl
              outline-none
              border-2 border-bgPrimary/10
              bg-bgPrimary/5
              hover:border-bgPrimary/30
              focus:border-bgPrimaryring-bgPrimary
              focus:ring-3 focus:ring-bgPrimary
              focus:bg-bgPrimary/10
              transition-all duration-300 ease-out
            `}
          />
          {errors.name && (
            <span className="text-red-400 font-medium font-sans flex items-center gap-1.5 text-sm animate-pulse">
              <MessageSquareWarning className="w-4 h-4" />
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium font-sans text-bgPrimary/80 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "This field is required",
                maxLength: {
                  value: 15,
                  message: "Max length should be 15",
                },
                minLength: {
                  value: 8,
                  message: "Min length should be 8",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`
                w-full text-md text-bgPrimary placeholder:text-bgPrimary/30 placeholder:font-light
                p-2 rounded-xl
                outline-none
                border-2 border-bgPrimary/10
                bg-bgPrimary/5
                hover:border-bgPrimary/30
                focus:border-bgPrimaryring-bgPrimary
                focus:ring-3 focus:ring-bgPrimary
                focus:bg-bgPrimary/10
                transition-all duration-300 ease-out
                pr-12
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bgPrimary/30 hover:text-bgPrimary transition-all duration-200 hover:scale-110"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-400 font-medium font-sans flex items-center gap-1.5 text-sm animate-pulse">
              <MessageSquareWarning className="w-4 h-4" />
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="w-full text-right">
          <a
            href="/forgot-password"
            className="text-xs text-bgPrimary/30 hover:text-bgPrimary/60 transition-colors duration-200 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button - ELITE */}
        <button
          type="submit"
          className={`
            w-full bg-linear-to-r from-bgPrimary to-bgPrimary/80
            text-textPrimary
            font-semibold font-sans text-lg
            rounded-xl
            hover:cursor-pointer
            hover:from-bgPrimary/90 hover:to-bgPrimary
            hover:shadow-xl hover:shadow-bgPrimaryring-bgPrimary/30
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-300 ease-out
           px-5 py-2 border 
          `}
        >
          Create
        </button>

        {/* OR Divider - ELITE */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-bgPrimary/20 to-bgPrimary/20" />
          <span className="text-bgPrimary/30 text-xs font-medium tracking-widest uppercase">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent via-bgPrimary/20 to-bgPrimary/20" />
        </div>

        {/* Social Login Buttons - ELITE */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={async () => {
              signIn("google", { callbackUrl: "/profile" });
            }}
            className="hover:cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-bgPrimary/10 bg-bgPrimary/5 hover:bg-bgPrimary/10 hover:border-bgPrimary/30 hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group"
          >
            <SiGoogle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Google</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              signIn("github", { callbackUrl: "/profile" });
            }}
            className="hover:cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-bgPrimary/10 bg-bgPrimary/5 hover:bg-bgPrimary/10 hover:border-bgPrimary/30 hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group"
          >
            <SiGithub className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">GitHub</span>
          </button>
        </div>

        {/* Sign Up Link */}

        <a
          href="/login"
          className="text-bgPrimary/30 text-xs mt-2 hover:underline hover:text-bgPrimary/80 hover:cursor-pointer transition-all duration-200 font-medium"
        >
          Have An Account?{" "}
        </a>
      </form>
    </div>
  );
}
