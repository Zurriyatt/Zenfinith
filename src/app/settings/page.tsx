"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X, Menu   } from "lucide-react";
import { settingsConfig } from "@/lib/settingsConfig";
import { Inter } from "next/font/google";
import SelectItems from "@/components/SettingsComponents/selectItems";
import { defaultSettings } from "@/lib/defaultSettings";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { saveSettings, SettingsState } from "@/lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Settings() {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const reduxSettings = useAppSelector((state) => state.settings);

  // Local copy for editing – initialized from Redux once available
  const [virtualSettings, setVirtualSettings] = useState(
    reduxSettings ?? defaultSettings,
  );

  // Sync local state when Redux settings change (e.g., after fetch or after save)
  useEffect(() => {
    if (reduxSettings) {
      setVirtualSettings(reduxSettings);
    }
  }, [reduxSettings]);

  // Detect if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(virtualSettings) !== JSON.stringify(reduxSettings);
  }, [virtualSettings, reduxSettings]);

  const handleSettingChange = (
    sectionKey: string,
    fieldKey: string,
    value: any,
  ) => {
    setVirtualSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev as any)[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  const handleSave = () => {
    if (hasChanges) {
      dispatch(saveSettings(virtualSettings));
    }
  };

  const handleCancel = () => {
    if (reduxSettings) {
      setVirtualSettings(reduxSettings);
    }
  };

  const [activeSection, setActiveSection] = useState<string | null>("appearance");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleSectionClick = (key: string) => {
    setActiveSection(key);
    if (!isDesktop) setMobileSidebarOpen(false);
  };

  // Sidebar content (unchanged)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-5">
        <h2 className={`text-lg font-semibold ${inter.className}`}>Settings</h2>
        {!isDesktop && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {settingsConfig.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.key;
          return (
            <button
              key={section.key}
              onClick={() => handleSectionClick(section.key)}
              className={`w-full flex hover:cursor-pointer items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.title}
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Main content with header containing section title + action buttons
  const mainContent = activeSection ? (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* ─── Header row: Title + Save/Cancel ─── */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-semibold ${inter.className}`}>
          {settingsConfig.find((s) => s.key === activeSection)?.title}
        </h2>

        <div className="flex items-center gap-2">
          {/* Cancel button */}
          <button
            disabled = {!hasChanges}
            onClick={handleCancel}
            className={`px-4 py-2 rounded-md border border-border bg-transparent text-textPrimary/70 hover:text-textPrimary hover:bg-bgSecondary/80 transition-colors duration-200 text-sm font-medium  ${hasChanges
                ? "cursor-pointer"
                : "cursor-not-allowed"}`}
          >
            Cancel
          </button>

          {/* Save button – muted when no changes */}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              hasChanges
                ? "bg-active text-white hover:bg-active/90 cursor-pointer"
                : "bg-active/40 text-white/50 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ─── Fields ─── */}
      <div className="space-y-6">
        {settingsConfig
          .find((s) => s.key === activeSection)
          ?.fields.map((field) => {
            const currentValue = (virtualSettings as any)[activeSection]?.[field.key];
            return (
              <div
                key={field.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-bgSecondary/50 dark:bg-[#0a0a0a]/50 border border-border"
              >
                <div>
                  <p className="text-sm font-medium">{field.label}</p>
                  {field.description && (
                    <p className="text-xs text-textPrimary/60 mt-1">
                      {field.description}
                    </p>
                  )}
                </div>
                <div className="text-sm text-textPrimary/40">
                  {field.type === "toggle" && (
                    <Toggle
                      checked={!!currentValue}
                      onToggle={(val) =>
                        handleSettingChange(activeSection!, field.key, val)
                      }
                    />
                  )}
                  {field.type === "select" && (
                    <SelectItems
                      socials={field}
                      current={currentValue}
                      onChange={(val:string) => handleSettingChange(activeSection!, field.key, val)
                      }
                    />
                  )}
                  {field.type === "action" && <ActionButton title={field.label} />}
                  {field.type === "list" && <ListButton title={field.label} />}
                  {field.type === "danger" && <DeleteButton title={field.label} />}
                  {field.type === "email" && (
                    <EmailInput
                    currSettings = {virtualSettings.billing.invoiceEmail}
                      value={currentValue ?? ""}
                      onChange={(val) =>
                        handleSettingChange(activeSection!, field.key, val)
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center text-textPrimary/40">
      <p className="text-sm">Select a section to edit settings</p>
    </div>
  );

  return (
    <div
      className={`h-screen w-[90vw] flex ${!isDesktop && "flex-col"} bg-bgPrimary text-textPrimary`}
    >
      {/* Mobile layout (unchanged) */}
      {!isDesktop && (
        <>
          <div className="flex items-center px-4 justify-between">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-md hover:bg-bgSecondary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className={`font-semibold text-2xl sm:text-3xl ${inter.className}`}>
              Settings
            </span>
            <div />
          </div>

          {mobileSidebarOpen && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
              aria-hidden="true"
            />
          )}
          <aside
            className={`fixed top-0 left-0 w-72 rounded-sm h-full bg-[#1A1D1F] dark:bg-black text-white shadow-2xl transition-all animate-[cubic-bezier(0.68, -0.6, 0.32, 1.6)] z-52 ${
              mobileSidebarOpen ? "translate-0" : "translate-x-[calc(-288px)]"
            } duration-400`}
          >
            {sidebarContent}
          </aside>
          <div className="flex-1 pt-4 overflow-y-auto">{mainContent}</div>
        </>
      )}

      {/* Desktop layout (unchanged) */}
      {isDesktop && (
        <>
          <aside className="w-64 rounded-sm h-full bg-[#1A1D1F] dark:bg-black text-white grow-0 shrink border-r border-white/10">
            {sidebarContent}
          </aside>
          <div className="grow overflow-y-auto">{mainContent}</div>
        </>
      )}
    </div>
  );
}

/* ─── Interactive subcomponents (only added props) ─── */

export function Toggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: (val: boolean) => void;
}): React.ReactNode {
  return (
    <div
      onClick={() => onToggle(!checked)}
      className="bg-[#1A1D1F] w-16 h-7 flex items-center p-1.5 hover:cursor-pointer rounded-2xl transition-colors duration-200"
    >
      <div
        className={`${
          checked ? "bg-emerald-400 translate-x-8" : "bg-muted-foreground translate-0"
        } rounded-4xl w-5 h-5 transition-all duration-200 ease-[cubic-bezier(0.76,0,0.24,1)]`}
      />
    </div>
  );
}

export function ActionButton({ title }: { title: string }): React.ReactNode {
  const router = useRouter()
  return (
    <button onClick={async ()=>{
      console.log("entered fr")
      if(title ==="Change Password"){
        router.replace("/changePassword")
      }
      if(title === "Active Devices"){
        router.replace("/activeDevices")
      }
      if(title ==="Delete Account"){
        
      }
    }} className="border-3 bg-linear-to-r from-textPrimary to-chart-4 dark:from-textPrimary dark:to-textPrimary hover:to-textPrimary hover:from-chart-4 hover:cursor-pointer font-medium font-sans hover:border-bgPrimary/50 transition-all duration-200 ease-in text-bgSecondary rounded-md p-2 ">
      {title}
    </button>
  );
}

export function ListButton({ title }: { title: string }): React.ReactNode {
  return (
    <button className="border-3  bg-linear-to-r from-textPrimary to-chart-3 hover:to-textPrimary hover:from-chart-3 dark:from-textPrimary dark:to-textPrimary from hover:cursor-pointer font-medium font-sans hover:border-bgPrimary/50 transition-all duration-200 ease-in text-bgSecondary rounded-md p-2 ">
      {title}
    </button>
  );
}

export function DeleteButton({ title }: { title: string }): React.ReactNode {
  return (
    <button onClick = {async() =>{ 
      const res = await fetch("/api/user/delete-account", {method:"POST"})
      const data = await res.json();
      if(data.success){ 
        toast.success("Accont Deleted Successfully!")
      }else{
        toast.error(data.error);
      }
    }} className="border-2 bg-linear-to-r from-destructive/80 to-destructive/75 hover:to-destructive/90 hover:from-destructive hover:cursor-pointer font-medium font-sans hover:border-textPrimary/50 transition-all duration-200 ease-in text-bgSecondary rounded-md p-2 ">
      {title}
    </button>
  );
}

export function EmailInput({
  currSettings,
  value,
  onChange,
}: {
  currSettings:string
  value: string;
  onChange: (val: string) => void;
}): React.ReactNode {
  return (
    <input
      type="email"

      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={value}
      className="w-full text-md text-textPrimary placeholder:text-textPrimary/30 placeholder:font-light p-2 rounded-xl outline-none border-2 border-bgPrimary/10 bg-textPrimary/5 hover:border-bgPrimary/30 focus:border-bgPrimary ring-bgPrimary focus:ring-3 focus:ring-textPrimary/50 transition-all duration-300 ease-out"
    />
  );
}