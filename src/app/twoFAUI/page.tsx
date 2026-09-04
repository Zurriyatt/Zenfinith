"use client";
import React from "react";
import { useState,useEffect,useRef } from "react";
import { Shield, ArrowLeft, TableOfContents } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function TwoFAUI(): React.ReactNode {
  const [loading,setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  const [email,setEmail] = useState("Anonymous@randomUser.com")
  const router = useRouter();
  const [otp,setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (value: string, index: number) => {
  const digit = value.replace(/\D/g, "").slice(0, 1); // only the first digit
  if (!digit) return; // ignore empty or non‑numeric
  const newOtp = [...otp];
  newOtp[index] = digit;
  setOtp(newOtp);
  // advance to next input
  if (index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    // If current box is empty, move back and clear that box too
    const newOtp = [...otp];
    newOtp[index - 1] = "";
    setOtp(newOtp);
    inputRefs.current[index - 1]?.focus();
  } else if (e.key === "Backspace") {
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);
  }
};
  return (
    <article className="w-full max-w-110 bg-textPrimary text-bgPrimary border border-zinc-900 rounded-2xl flex flex-col items-center px-10 py-10 shadow-2xl antialiased">
      {/* 🧭 NAVIGATION HEADER BLOCK */}
      <span className="flex items-center gap-1.5 self-start text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-bgPrimary cursor-pointer transition-colors mb-10 group">
        <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
        Back To Login
      </span>

      {/* 🛡️ GRAPHIC IDENTIFIER SHIELD BADGE */}
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br  dark:from-[#d4b681]/30 border-2 dark:border-active/80 dark:to-active/20 from-active/80  border-active to-active/30 text-bgPrimary  mb-6 shadow-inner">
        <Shield className="w-6 h-6 stroke-[1.5]" />
      </div>

      {/* 📝 CONTEXT TYPOGRAPHY STACK */}
      <h2 className="text-2xl font-bold tracking-tight mb-2 text-bgPrimary ">
        Two-factor authentication
      </h2>
      {otpSent? <><p className="text-sm text-textSecondary text-center max-w-70 mb-8 leading-relaxed">
        Enter the 6-digit code sent to{" "}
        <span className="font-mono text-textSecondary"></span>
      </p>
    
      {/* ⚡ WORKING SECTION (The OTP Action Container) */}
      <div className="w-full flex flex-col items-center">
        {/* INPUT GRID MATRIX: 6 Squares without logic */}
        <div className="flex flex-row gap-2 w-full mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square relative text-bgPrimary"
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                maxLength={1}
                className="
                    absolute inset-0 w-full h-full text-center text-2xl font-bold rounded-xl 
                    border border-zinc-800/80 hover:border-zinc-800 
                    bg-secondary-foreground transition-all focus:outline-none
                    focus:border-[#dca042] focus:ring-4 focus:ring-[#dca042]/10
                    "
              />
            </div>
          ))}
        </div>

        {/* 🚀 \FORM ACTION UNLOCKED BUTTON (static disabled state) */}
        <button
          disabled={loading}
          onClick={async () =>{ 
            setLoading(true)
            if(otp.length < 6){
              toast.error("Enter Full OTP!")
              return
            }
            const fetchreq = await fetch("/api/login/twoFA/otp",{method: "POST",body: JSON.stringify({otp : otp})});
            const data = await fetchreq.json();
            if(data.success){
              toast.success("You are logged IN!");
              setTimeout(() =>{ 
                router.replace("/profile")
              },2000)
            }else { 
              toast.error(data.error)
            }
            setLoading(false)
          }}
          
          className="
              w-full py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 ease-in
              bg-linear-to-br  
              hover:dark:from-[#d4b681]/30 border-2 dark:hover:border-bgPrimary hover:dark:to-active/20 from-active/50 to-active/20
              dark:from-[#d4b681]/30 hover:border-2 dark:border-active  dark:to-active/20 hover:from-active/80  hover:border-active hover:to-active/30 hover:cursor-pointer 
              
            "
        >
          {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-textPrimary/30 border-t-textPrimary" />
                Verifying...
              </span>
            ) : (
              "Verify Identity"
            )}
        </button>
      </div>

      {/* 🔄 SECONDARY RETRY TRIGGER */}
      <span onClick={
        async () =>{   
          const fetchD = await fetch("/api/login/twoFA/generateOTP",{method : "POST"})
          const data = await fetchD.json();
            if(data.success){
              toast.success("OTP Sent!")
            }else { 
              toast.error("Failed to send OTP!");
            }
        }
      } className="text-xs font-semibold text-zinc-500 hover:text-bgPrimary cursor-pointer transition-colors mt-6">
        Resend Code
      </span></> :<><p className="text-sm text-textSecondary text-center max-w-70 mb-8 leading-relaxed">
        For Login Otp code, press Send!
        <span className="font-mono text-textSecondary"></span>
      </p>
    
       <button
            onClick={async () =>{
              setLoading(true)  
          const fetchD = await fetch("/api/login/twoFA/generateOTP",{method : "POST"})
          const data = await fetchD.json();
            if(data.success){
              toast.success("OTP Sent!")
              setOtpSent(true)
            }else { 
              toast.error("Failed to send OTP, Wait for some minutes!");
            }
            setLoading(false)  
        }}
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
                Sending...
              </span>
            ) : (
              "Send Code"
            )}
          </button></>}
      
    </article>
  );
}
