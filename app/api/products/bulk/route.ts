import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const validStatuses = ["active", "inactive", "draft"];

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, status } = await request.json();

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !validStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid bulk update" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("products")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .in("id", ids);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Products updated successfully",
    });
  } catch (error) {
    console.error("Bulk product update error:", error);

    return NextResponse.json(
      { error: "Failed to update products" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No products selected" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("products").delete().in("id", ids);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Products deleted successfully",
    });
  } catch (error) {
    console.error("Bulk product delete error:", error);

    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 },
    );
  }
}
