"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type SaveProductState = {
  error: string | null;
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

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

function imageValidationError(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const knownExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
  const looksLikeImage =
    file.type.startsWith("image/") || knownExtensions.includes(extension);

  if (!looksLikeImage) {
    return "Please choose a JPG, PNG, WebP, GIF or AVIF image.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "That image is larger than 10 MB. Please choose a smaller file.";
  }

  return null;
}

function imageExtension(file: File): string {
  return (
    IMAGE_EXTENSIONS[file.type] ??
    (file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg")
  );
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

export async function saveProduct(
  _previousState: SaveProductState,
  formData: FormData
): Promise<SaveProductState> {
  const supabase = await createClient();

  try {
    const id = formData.get("id") as string | null;
    const name = (formData.get("name") as string | null)?.trim() ?? "";
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

    if (!name) {
      return { error: "Product name is required." };
    }

    if (!Number.isFinite(price) || price < 0) {
      return { error: "Please enter a valid price." };
    }

    const productData = {
      name,
      slug: await uniqueSlug(supabase, slugify(name), id),
      category_id: categoryId || null,
      description,
      price,
      compare_at_price: compareAtPriceRaw ? parseFloat(compareAtPriceRaw) : null,
      stock_quantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
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
      if (error) return { error: error.message };
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select("id")
        .single();
      if (error) return { error: error.message };
      productId = data.id;
    }

    const imageEntry = formData.get("image");
    const imageFile = imageEntry instanceof File ? imageEntry : null;

    if (productId && imageFile && imageFile.size > 0) {
      const validationError = imageValidationError(imageFile);
      if (validationError) return { error: validationError };

      const filePath = `${productId}/${Date.now()}.${imageExtension(
        imageFile
      )}`;

      const { error: uploadError } = await supabase.storage
        .from("public_images")
        .upload(filePath, imageFile, {
          contentType: imageFile.type || "application/octet-stream",
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) {
        return { error: `Image upload failed: ${uploadError.message}` };
      }

      const { count, error: countError } = await supabase
        .from("product_images")
        .select("id", { count: "exact", head: true })
        .eq("product_id", productId);

      if (countError) {
        await supabase.storage.from("public_images").remove([filePath]);
        return { error: countError.message };
      }

      const { error: imageInsertError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          storage_path: filePath,
          is_primary: !count || count === 0,
          display_order: count ?? 0,
        });

      if (imageInsertError) {
        await supabase.storage.from("public_images").remove([filePath]);
        return { error: imageInsertError.message };
      }
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/products");
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the product.",
    };
  }

  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin");
}
