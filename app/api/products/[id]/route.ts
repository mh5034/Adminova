import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validation/product";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET product error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { data: existingProduct } = await supabase
      .from("products")
      .select(
        "status, stock, price, category, name, description, image_url, inactive_reason",
      )
      .eq("id", id)
      .single();

    const { data: product, error } = await supabase
      .from("products")
      .update({
        ...result.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update product error:", error);

      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 },
      );
    }

    const activities = [];

    if (existingProduct) {
      if (existingProduct.status !== product.status) {
        activities.push({
          product_id: id,
          action: "status_changed",
          description: `Status changed from ${existingProduct.status} to ${product.status}`,
        });
      }

      if (existingProduct.stock !== product.stock) {
        activities.push({
          product_id: id,
          action: "stock_changed",
          description: `Stock changed from ${existingProduct.stock} to ${product.stock}`,
        });
      }

      if (existingProduct.price !== product.price) {
        activities.push({
          product_id: id,
          action: "price_changed",
          description: `Price changed from $${existingProduct.price} to $${product.price}`,
        });
      }

      if (existingProduct.inactive_reason !== product.inactive_reason) {
        activities.push({
          product_id: id,
          action: "inactive_reason_changed",
          description: `Inactive reason changed from ${existingProduct.inactive_reason} to ${product.inactive_reason}`,
        });
      }

      if (existingProduct.category !== product.category) {
        activities.push({
          product_id: id,
          action: "category_changed",
          description: `Category changed from ${existingProduct.category} to ${product.category}`,
        });
      }

      if (existingProduct.name !== product.name) {
        activities.push({
          product_id: id,
          action: "name_changed",
          description: `Name changed from "${existingProduct.name}" to "${product.name}"`,
        });
      }

      if (existingProduct.description !== product.description) {
        activities.push({
          product_id: id,
          action: "description_changed",
          description: "Product description was updated",
        });
      }
    }

    if (activities.length > 0) {
      const { error: activityError } = await supabase
        .from("product_activities")
        .insert(activities);

      if (activityError) {
        console.error("Activity logging error:", activityError);
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PATCH product error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Delete product error:", error);

      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE product error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
