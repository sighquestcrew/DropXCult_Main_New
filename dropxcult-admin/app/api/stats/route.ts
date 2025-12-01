import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate Total Revenue
  const revenueAggregation = await prisma.order.aggregate({
    _sum: {
      totalPrice: true
    },
    where: {
      isPaid: true
    }
  });

  const totalRevenue = revenueAggregation._sum.totalPrice || 0;

  return NextResponse.json({
    ordersCount,
    productsCount,
    usersCount,
    totalRevenue,
  });
}