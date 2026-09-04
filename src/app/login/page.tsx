  "use client";

  import React, { useState, useEffect } from "react";
  import { SessionVerify } from "../api/user/verify/route";
  import { useForm, SubmitHandler } from "react-hook-form";
  import {
    MessageSquareWarning,
    Eye,
    EyeOff,
    Mail,
    User,
    Lock,
    Timer,
  } from "lucide-react";
  import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
  import { toast } from "sonner";
  import FingerprintJS from "@fingerprintjs/fingerprintjs";
  import { useSession, signIn, signOut } from "next-auth/react";
  import { useRouter } from "next/navigation";

  type Inputs = {
    email: string;
    password: string;
    name: string;
    fingerprint: string;
  };

  export default function LoginFormm(): React.ReactNode {
    const router = useRouter();
    const { data: session } = useSession();
    const [fpPromise, setFpPromise] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Inputs>();

    useEffect(() => {
      if (typeof window !== undefined) {
        FingerprintJS.load().then((fpInstance) => {
          setFpPromise(fpInstance);
        });
      }
    }, []);
    useEffect(() => {
      let timer: any;
      async function getData() {
        const res = await fetch("/api/sessionGet", { method: "GET" });
        const data = await res.json();
        if (data.res) {
          toast.success("You are already Logged IN!");
          timer = setTimeout(() => {
            router.replace("/profile");
          }, 2000);
        } else {
          toast.error(data.error);
        }
      }

      getData();

      // 3. Return the cleanup function directly from the body of useEffect
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, []);

    const submitChange: SubmitHandler<Inputs> = async (data) => {
      setLoading(true);
      try {
        const fp = await fpPromise;
        const result = await fp.get();
        console.log(result.visitorId, "visitor id", data);
        data.fingerprint = result.visitorId;
        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(data),
        });
        const convertedData = await response.json();

        if (convertedData.success === true) {
          if (convertedData.type === "twoFAToken") {
            toast.success("You will be leaded to OTP page!");
            setTimeout(() => {
              router.replace("/twoFAUI");
            }, 2000);
          } else {
            toast.success("✅Acount Logged In!");
            setTimeout(() => {
              router.replace("/profile");
            }, 5000);
          }
        } else {
          toast.error(`❌${convertedData.error}`);
          console.log(convertedData.error);
        }
      } catch (error) {
        console.error("SignUP failed!");
      }
      setLoading(false);
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
              Welcome Back!
            </h2>
            <p className="text-bgPrimary/40 text-sm mt-1 font-light">
              Login your account back!
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
                focus:border-bgPrimary ring-bgPrimary
                focus:ring-3 focus:ring-bgPrimary/50
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
              active:scale-[0.98]
              transition-all duration-300 ease-out
            px-5 py-2 border ${loading ? "bg-linear-to-r from-bgPrimary/10  to-bgPrimary/40 " : "hover:from-bgPrimary/90 hover:to-bgPrimary hover:shadow-bgPrimary ring-bgPrimary/30 hover:scale-[1.02]"}
            `}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-textPrimary/30 border-t-textPrimary" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* OR Divider - ELITE */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-bgPrimary/20 to-bgPrimary/20" />
            <span className="text-bgPrimary/30 text-xs font-medium tracking-widest uppercase">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-liner-to-l from-transparent via-bgPrimary/20 to-bgPrimary/20" />
          </div>

          {/* Social Login Buttons - ELITE */}
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={async () => {
                setLoading(true); // Show your loading spinner
                try {
                  let visitorId = "";

                  // 1. Check if the instance loaded
                  if (fpPromise) {
                    const result = await fpPromise.get();
                    visitorId = result.visitorId;
                  }

                  // 2. Strict Frontend Guard: Block if fingerprint collection failed
                  if (!visitorId) {
                    toast.error(
                      "🔒 Security check failed: Could not generate a secure device fingerprint. Please disable ad-blockers and try again.",
                    );
                    setLoading(false);
                    return; // Stop execution entirely. Do not fire signIn()
                  }

                  // 3. Proceed only if fingerprint exists
                  const customData = { fingerprint: visitorId };
                  const base64Data = btoa(JSON.stringify(customData));

                  await signIn("google", {
                    callbackUrl: `/profile?meta=${base64Data}`,
                  });
                } catch (error) {
                  console.error(`google sign in failed`, error);
                  toast.error("Social login failed. Please try again.");
                  setLoading(false);
                }
              }}
              className="hover:cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-bgPrimary/10 bg-bgPrimary/5 hover:bg-bgPrimary/10 hover:border-bgPrimary/30 hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group"
            >
              <SiGoogle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Google</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                setLoading(true); // Show your loading spinner
                try {
                  let visitorId = "";

                  // 1. Check if the instance loaded
                  if (fpPromise) {
                    const result = await fpPromise.get();
                    visitorId = result.visitorId;
                  }

                  // 2. Strict Frontend Guard: Block if fingerprint collection failed
                  if (!visitorId) {
                    toast.error(
                      "🔒 Security check failed: Could not generate a secure device fingerprint. Please disable ad-blockers and try again.",
                    );
                    setLoading(false);
                    return; // Stop execution entirely. Do not fire signIn()
                  }

                  // 3. Proceed only if fingerprint exists
                  const customData = { fingerprint: visitorId };
                  const base64Data = btoa(JSON.stringify(customData));

                  await signIn("github", {
                    callbackUrl: `/profile?meta=${base64Data}`,
                  });
                } catch (error) {
                  console.error(`github sign in failed`, error);
                  toast.error("Social login failed. Please try again.");
                  setLoading(false);
                }
              }}
              className="hover:cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-bgPrimary/10 bg-bgPrimary/5 hover:bg-bgPrimary/10 hover:border-bgPrimary/30 hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group"
            >
              <SiGithub className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}

          <a
            href="/signup"
            className="text-bgPrimary/30 text-xs mt-2 hover:underline hover:text-bgPrimary/80 hover:cursor-pointer transition-all duration-200 font-medium"
          >
            Dont Have An Account?{" "}
          </a>
        </form>
      </div>
    );
  }
