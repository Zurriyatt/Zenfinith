import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "../../user/verify/route";
import cloudinary from "@/lib/cloudinary";

async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { upload_preset: "ml_default", folder: "zenfinith_products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  return result.secure_url;
}

export async function POST(req: NextRequest) {
  try {
    // Admin check
    const session = await SessionVerify();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const badge = (formData.get("badge") as string) || "";
    const totalDiscount = parseFloat(
      (formData.get("totalDiscount") as string) || "0"
    );

    // Basic validation
    if (!name || !price || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    // Upload images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const url = await uploadImage(file);
      imageUrls.push(url);
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        category,
        description,
        badge,
        totalDiscount,
        images: imageUrls,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}