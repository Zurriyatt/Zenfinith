"use client";

import {
  Search,
  ShoppingBag,
  PanelRightInactive,
  X,
  SettingsIcon,
  HeartIcon,
  UserPlus,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { Jost } from "next/font/google";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from 'next/link'
import Image from "next/image";
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Navigation items (DRY principle)
const navItems = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Shop All", href: "/collections/shop-all" },
  { label: "Categories", href: "/collections" },
  { label: "Sale", href: "/collections/sale" },
];

// Icon components (memoized to prevent re-renders)
const NavIcons = () => (
  <div className="hidden sm:flex gap-3 text-icons">

    <Link href="/collections/shop-all"><Search className="w-8 h-8 p-1.5 transition-all duration-250 ease-in-out hover:bg-textPrimary hover:text-bgPrimary rounded-0 hover:rounded-md hover:cursor-pointer" /></Link>
    
    <Link
    href={"/cart"}><ShoppingBag className="w-8 h-8 p-1.5 transition-all duration-250 ease-in-out hover:bg-textPrimary hover:text-bgPrimary rounded-0 hover:rounded-md hover:cursor-pointer" />
    </Link>
  </div>
);

export default function Navbar() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [User, setUser] = useState<null | {
    name: string;
    id: string;
    bio: string;
    profileImage: string;
    coverImage: string;
  }>(null);
  const toggleSidebar = () => setSidebar((prev) => !prev);

  useEffect(() => {
    async function getData() {
      const res = await fetch("/api/sessionGet", { method: "GET" });
      const data = await res.json();
      if (data.res) {
        setUser(data.res);
      } else {
        setUser(null);
      }
    }
    getData();
  }, []);
  return (
    <>
      {/* Navigation */}
      <nav
        className="w-[90vw]  bg-bgSecondary/80 dark:bg-[#0a0a0a]/70 
  backdrop-blur-md 
  text-textPrimary 
  flex justify-between items-center 
  rounded-xl p-2 sm:px-4 sm:py-2 
  shadow-sm 
  border border-border dark:border-white/10
"
      >
        {/* Logo */}

        <Link href = {"/"} className="flex items-end">
          <span className="font-serif sm:text-3xl text-2xl font-light tracking-[-0.04em] text-active bg-clip-text [text-shadow:0_2px_4px_rgba(74,115,94,0.15)]">
            Zen
          </span>
          <span className="font-sans sm:text-2xl text-xl font-medium tracking-[-0.02em] text-[#1A1D1F] dark:text-[#E5E5E5]">
            finith
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex gap-4 ${jost.className}`}>
          {navItems.map((item) => (
            <Link 
            key={item.label}
            href={item.href}>
            <span
            
              key={item.label}
              className="group overflow-x-hidden hover:cursor-pointer flex flex-col gap-px transition-all duration-250 ease-in-out text-textPrimary/70 hover:text-textPrimary active:text-textPrimary text-center sm:font-semibold sm:text-sm text-sm"
            >
              {item.label}
              <span className="translate-x-[calc(-100%)] group-hover:translate-x-0 bg-textPrimary h-px transition-all duration-250 ease-in-out group-active:translate-x-0" />
            </span>
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-8 ">
          <NavIcons />
          <button
            onClick={toggleSidebar}
            className="flex hover:cursor-pointer text-icons hover:text-textPrimary transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <PanelRightInactive className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebar && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed h-screen top-0 right-0 w-[60vw] sm:w-[40vw] md:w-[30vw] bg-textPrimary text-bgPrimary z-40 p-6 sm:p-8 md:p-12 transition-transform duration-500 ease-[cubic-bezier(0.85,-0.4,0.15,1.4)] overflow-auto ",
          sidebar ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Close Button */}

        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200 mb-8 hover:cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
          <span className="text-sm font-medium">Close</span>
        </button>
        <div className="flex gap-3">
          <Image
            src={User?.profileImage || "/assets/profile.jpg"}
            alt="Profile"
            width={50}
            height={50}
            className="rounded-[50%] w-13 h-13 object-cover object-center"
          ></Image>
          <div className="flex flex-col">
            <a
              href="/profile"
              className="flex flex-col font-sans font-bold text-md text-bgPrimary"
            >
              {User ? User.name : "Anonymous Profile"}
            </a>
            <a
              href="/profile"
              className="flex flex-col font-sans font-400 text-bgPrimary "
            >
              {User ? User.bio : "Account is not Logged IN!"}
            </a>
          </div>
        </div>
        {!User ? (
          <div className="space-y-2 my-10">
            <div className="flex gap-2 hover:opacity-70">
              <LogIn />
              <a
                href="/login"
                className="block text-xl font-medium hover:opacity-70"
              >
                Login
              </a>
            </div>
            <div className="flex gap-2 hover:opacity-70">
              <UserPlus />
              <a
                href="/signup"
                className="block text-xl font-medium hover:opacity-70"
              >
                Signup
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-2 my-10">
          
              {loading ? (
                  <button
              className="flex gap-2 text-xl font-medium  p-2 rounded-lg hover:cursor-not-allowed justify-center items-center transition-all duration-250 ease-in-out bg-bgPrimary/3 border-bgPrimary/10"
              disabled
            >
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-bgPrimary/30 border-t-bgPrimary text-bgPrimary" />
                  Logging Out!
                </button>
              ):(  <button
              className="flex gap-2 text-xl font-medium border border-bgPrimary/40 hover:border-bgPrimary hover:bg-bgSecondary/7 p-2 rounded-lg hover:cursor-pointer justify-center items-center transition-all duration-250 ease-in-out"
              onClick={async () => {
                setLoading(true);
                const Logout = await fetch("/api/user/logout", {
                  method: "POST",
                });
                const data = await Logout.json();
                if (data.success) {
                  toast.success(data.res);
                } else {
                  toast.error(data.error);
                }
                setLoading(false);
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              }}
            ><LogIn />
              Logout</button>)}
            
          </div>
        )}

        {/* Sidebar Content */}
        <div className="space-y-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-xl font-medium hover:opacity-70 transition-opacity duration-200"
            >
              {item.label}
            </a>
          ))}
          <hr className="border-border/20" />
          <div className="space-y-4">
            <div className="flex gap-2 hover:opacity-70">
              <ShoppingBag />
              <a href="/cart" className="block text-xl font-medium ">
                Cart
              </a>
            </div>
            <div className="flex gap-2 hover:opacity-70">
              <HeartIcon />
              <a href="/whistlist" className="block text-xl font-medium ">
                Whistlist
              </a>
            </div>
          </div>
          <div className="flex gap-2 space-y-4 hover:opacity-70">
            <SettingsIcon />
            <a href="/settings" className="block text-xl font-medium ">
              Settings
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
