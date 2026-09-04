"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
interface ProfileFormValues {
  name: string;
  bio: string;
}

export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  // File states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Handle cover file change
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitMessage(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      if (coverFile){ formData.append("cover", coverFile)}
      else {formData.append("cover", "")};
      if (avatarFile){ formData.append("avatar", avatarFile)}
      else {{ formData.append("avatar", "")}}
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      toast.success("Profile Updated!")
      setSubmitMessage({
        type: "success",
        text: "Changes saved successfully!",
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <div>
      <header>
        <h2 className="text-2xl md:text-3xl text-textPrimary font-[Inter] font-bold p-6">
          Profile
        </h2>
      </header>
      <main>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card shadow-md flex flex-col p-3 rounded-md w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] py-0"
        >
          {/* Cover Image */}
          <div className="flex sm:flex-row flex-col justify-between p-3 border-b border-textPrimary/30 items-start sm:items-center">
            <span className="font-semibold font-[Inter] text-md text-textPrimary gap-5 sm:gap-2 sm:flex-col flex"> 
              <span>Cover Image</span>
              <span className = "text-sm font-[Inter] font-normal text-textPrimary/70 mt-1">Upload your cover Image.</span>
            </span>
            <div className="relative group w-32 h-20 rounded-lg overflow-hidden flex justify-center items-center">
              <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                onChange={handleCoverChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Image
                width={128}
                height={80}
                src={coverPreview || "/assets/cover.jpg"}
                alt="Cover"
                className="object-cover w-full h-full absolute inset-0 pointer-events-none group-hover:opacity-50 transition-opacity duration-200"
              />
              <Pencil className="w-5 h-5 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20" />
            </div>
          </div>

          {/* Avatar */}
          <div className="flex sm:flex-row flex-col justify-between p-3 border-b border-textPrimary/30 items-start sm:items-center">
             <span className="font-semibold font-[Inter] text-md text-textPrimary gap-6 sm:gap-2 sm:flex-col flex">
              <span>Avatar</span>
              <span className = "text-sm font-normal text-textPrimary/70 mt-1">Upload your Avatar.</span>
            </span>
            <div className="relative group w-16 h-16 rounded-full flex justify-center items-center">
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 rounded-full"
              />
              <Image
                width={64}
                height={64}
                src={avatarPreview || "/assets/profile.jpg"}
                alt="Avatar"
                className="object-cover w-full h-full rounded-full absolute inset-0 pointer-events-none group-hover:opacity-50 transition-opacity duration-200"
              />
              <Pencil className="w-5 h-5 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20" />
            </div>
          </div>

          {/* Name */}
          <div className="flex sm:flex-row flex-col justify-between p-3 border-b border-textPrimary/30 items-start sm:items-center">
            <span className="font-semibold font-[Inter] text-md text-textPrimary">
              Name
            </span>
            <div className="w-full sm:w-40">
              <input
                className="border-2 outline-none border-textPrimary/20 hover:border-textPrimary/70 focus:border-textPrimary py-1 rounded-md pl-3 transition-all duration-200 ease-in w-full h-9"
                type="text"
                placeholder="Your Name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 12,
                    message: "Name cannot exceed 12 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex sm:flex-row flex-col justify-between p-3 border-b border-textPrimary/30 items-start sm:items-center">
            <span className="font-semibold font-[Inter] text-md text-textPrimary">
              Bio
            </span>
            <div className="w-full sm:w-40">
              <input
                className="border-2 outline-none border-textPrimary/20 hover:border-textPrimary/70 focus:border-textPrimary py-1 rounded-md pl-3 transition-all duration-200 ease-in w-full h-9"
                type="text"
                placeholder="Profile Bio"
                {...register("bio", {
                  required: "Bio is required",
                  minLength: {
                    value: 5,
                    message: "Bio must be at least 5 characters",
                  },
                  maxLength: {
                    value: 32,
                    message: "Bio cannot exceed 32 characters",
                  },
                })}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-md bg-linear-to-r from-textPrimary to-textPrimary/80 hover:from-textPrimary/90 hover:to-textPrimary
            hover:shadow-xl hover:shadow-texPrimary ring-textPrimary/30 text-background cursor-pointer font-semibold hover:bg-linear-to-l disabled:opacity-50 transition-all duration-300 ease-out"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            {submitMessage && (
              <p
                className={`text-sm mt-2 ${
                  submitMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {submitMessage.text}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
