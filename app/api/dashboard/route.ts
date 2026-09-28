import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const validRanges = ["7d", "30d", "90d", "all"] as const;

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);

    const requestedRange = searchParams.get("range") ?? "30d";

    const range = validRanges.includes(
      requestedRange as (typeof validRanges)[number],
    )
      ? requestedRange
      : "30d";

    let query = supabase
      .from("products")
      .select("category, price, stock, status, created_at");

    if (range !== "all") {
      const days = Number(range.replace("d", ""));
      const startDate = new Date();

      startDate.setDate(startDate.getDate() - days);

      query = query.gte("created_at", startDate.toISOString());
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    const totalProducts = products.length;

    const activeProducts = products.filter(
      (product) => product.status === "active",
    ).length;

    const lowStockProducts = products.filter(
      (product) => product.stock <= 10,
    ).length;

    const inventoryValue = products.reduce(
      (total, product) => total + Number(product.price) * product.stock,
      0,
    );

    const categoryMap = new Map<
      string,
      {
        category: string;
        products: number;
        stock: number;
      }
    >();

    const statusMap = new Map<string, number>();

    for (const product of products) {
      const existingCategory = categoryMap.get(product.category) ?? {
        category: product.category,
        products: 0,
        stock: 0,
      };

      existingCategory.products += 1;
      existingCategory.stock += product.stock;

      categoryMap.set(product.category, existingCategory);

      statusMap.set(product.status, (statusMap.get(product.status) ?? 0) + 1);
    }

    const categories = Array.from(categoryMap.values());

    const statuses = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    return NextResponse.json({
      metrics: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        inventoryValue,
      },
      categories,
      statuses,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 },
    );
  }
}
