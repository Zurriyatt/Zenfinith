// app/api/users/profile/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "../verify/route";
import cloudinary from "@/lib/cloudinary";

// Helper to upload a file buffer to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          upload_preset: "ml_default",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });

  return result.secure_url; // return the HTTPS URL
}

export async function PUT(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await SessionVerify();
    if (!session.success || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Parse form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const avatarInput = formData.get("avatar");
    const coverInput = formData.get("cover");

    // 3. Prepare update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;

    // 4. Handle avatar image
    if (avatarInput && avatarInput instanceof File && avatarInput.size > 0) {
      const avatarUrl = await uploadToCloudinary(avatarInput);
      updateData.profileImage = avatarUrl;
    } // else: don't touch the field, keep old/default

    // 5. Handle cover image
    if (coverInput && coverInput instanceof File && coverInput.size > 0) {
      const coverUrl = await uploadToCloudinary(coverInput);
      updateData.coverImage = coverUrl;
    } // else: don't touch

    // 6. Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        coverImage: updatedUser.coverImage,
        bio: updatedUser.bio,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 },
    );
  }
}
