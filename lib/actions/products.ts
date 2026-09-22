"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function parseListField(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string,
  excludeId?: string | null
): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    let query = supabase.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();

    if (!data) return slug;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export async function saveProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const categoryId = formData.get("category_id") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const compareAtPriceRaw = formData.get("compare_at_price") as string;
  const stockQuantity = parseInt(formData.get("stock_quantity") as string, 10);
  const isActive = formData.get("is_active") === "on";
  const isFeatured = formData.get("is_featured") === "on";
  const skinTypes = parseListField(formData.get("skin_types"));
  const skinConcerns = parseListField(formData.get("skin_concerns"));
  const keyIngredients = parseListField(formData.get("key_ingredients"));
  const ingredients = formData.get("ingredients") as string;
  const howToUse = formData.get("how_to_use") as string;
  const volume = formData.get("volume") as string;

  const productData = {
    name,
    slug: await uniqueSlug(supabase, slugify(name), id),
    category_id: categoryId || null,
    description,
    price,
    compare_at_price: compareAtPriceRaw ? parseFloat(compareAtPriceRaw) : null,
    stock_quantity: stockQuantity || 0,
    is_active: isActive,
    is_featured: isFeatured,
    skin_types: skinTypes,
    skin_concerns: skinConcerns,
    key_ingredients: keyIngredients,
    ingredients,
    how_to_use: howToUse,
    volume,
  };

  let productId = id;

  if (id) {
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  // Handle image upload (single new image for now — appended to product_images)
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${productId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("public_images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    // Check if this is the first image for the product
    const { count } = await supabase
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: filePath,
      is_primary: !count || count === 0,
      display_order: count ?? 0,
    });
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirect("/admin");
}