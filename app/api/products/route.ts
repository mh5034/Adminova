import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { productSchema } from "@/lib/validation/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100,
    );

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const allowedSortFields = ["name", "price", "stock", "created_at"];

    const requestedSort = searchParams.get("sort") || "created_at";

    const sort = allowedSortFields.includes(requestedSort)
      ? requestedSort
      : "created_at";

    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    // Pagination range
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase.from("products").select("*", { count: "exact" });

    // Search
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Category filter
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    // Status filter
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Sorting + pagination
    query = query.order(sort, { ascending: order === "asc" }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Products query error:", error);

      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid product data",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...result.data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Create product error:", error);

      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
