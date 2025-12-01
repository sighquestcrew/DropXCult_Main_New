import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all products, sort by newest first
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ADD THIS BELOW THE GET FUNCTION:
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, price, description, category, image, slug } = body;

    // Basic Validation
    if (!name || !price || !image || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        category,
        images: [image], // We store it as an array
        sizes: ["S", "M", "L", "XL"], // Default sizes
        stock: 50, // Default stock
        isFeatured: false,
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}