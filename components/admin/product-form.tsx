"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  CircleDollarSign,
  ImagePlus,
  Lightbulb,
  LoaderCircle,
  Package,
  Save,
  Sparkles,
} from "lucide-react";
import { saveProduct } from "@/lib/actions/products";
import { getProductImageUrl } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/admin/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  skin_types: string[];
  skin_concerns: string[];
  key_ingredients: string[];
  ingredients: string | null;
  how_to_use: string | null;
  volume: string | null;
};

const SKIN_TYPE_SUGGESTIONS = [
  "Oily",
  "Dry",
  "Combination",
  "Sensitive",
  "Normal",
  "All",
];

const SKIN_CONCERN_SUGGESTIONS = [
  "Acne",
  "Dryness",
  "Brightening",
  "Hydration",
  "Texture",
  "Anti-aging",
  "Oil control",
];

const INGREDIENT_SUGGESTIONS = [
  "Niacinamide",
  "Hyaluronic Acid",
  "Vitamin C",
  "Retinol",
  "Salicylic Acid",
  "Ceramides",
  "Glycerin",
  "SPF",
];

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-card/60 p-4 sm:p-5">
      <div className="flex items-start gap-3 border-b border-primary/10 pb-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-primary">
          {icon}
        </span>
        <div>
          <h2 className="font-serif text-lg text-primary">{title}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ProductFormSubmit({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="rounded-full px-5"
    >
      {pending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <Save aria-hidden="true" />
      )}
      {pending ? "Saving..." : isEditing ? "Save changes" : "Create product"}
    </Button>
  );
}

export function ProductForm({
  categories,
  product,
  imagePath,
}: {
  categories: Category[];
  product?: Product;
  imagePath?: string | null;
}) {
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  const previewSrc =
    preview ?? (imagePath ? getProductImageUrl(imagePath) : null);

  return (
    <form action={saveProduct} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-5">
          <FormSection
            icon={<Package className="size-4" aria-hidden="true" />}
            title="Product details"
            description="The essentials shoppers see first."
          >
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Gentle Hydrating Cleanser"
                defaultValue={product?.name}
                className="h-10 bg-background/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                name="category_id"
                value={categoryId}
                onValueChange={(value) => setCategoryId(value ?? "")}
              >
                <SelectTrigger
                  id="category_id"
                  className="h-10 w-full bg-background/60"
                >
                  <SelectValue placeholder="Choose a category">
                    {categories.find((c) => c.id === categoryId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="What makes it worth adding to a routine?"
                defaultValue={product?.description ?? ""}
                className="min-h-24 bg-background/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product image</Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/25 bg-secondary/30 text-primary/40 sm:size-24">
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt="Product image preview"
                      fill
                      unoptimized
                      sizes="96px"
                      className={preview ? "object-cover" : "object-contain p-2"}
                    />
                  ) : (
                    <ImagePlus className="size-6" aria-hidden="true" />
                  )}
                </div>

                <div className="flex-1">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="h-auto cursor-pointer border-primary/15 bg-background/60 py-2 text-xs file:mr-3 file:rounded-full file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
                  />
                  <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted-foreground">
                    {product
                      ? "Uploading a new image adds it to this product's gallery."
                      : "Optional — you can add more images after creating the product."}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={<CircleDollarSign className="size-4" aria-hidden="true" />}
            title="Pricing & inventory"
            description="Set the price and keep stock accurate."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={product?.price}
                  className="h-10 bg-background/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compare_at_price">Compare-at price</Label>
                <Input
                  id="compare_at_price"
                  name="compare_at_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Optional"
                  defaultValue={product?.compare_at_price ?? ""}
                  className="h-10 bg-background/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={product?.stock_quantity ?? 0}
                  className="h-10 bg-background/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume / size</Label>
                <Input
                  id="volume"
                  name="volume"
                  placeholder="e.g. 50ml"
                  defaultValue={product?.volume ?? ""}
                  className="h-10 bg-background/60"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={<Sparkles className="size-4" aria-hidden="true" />}
            title="Skincare profile"
            description="Help shoppers find the right fit. Press Enter to add each tag."
          >
            <div className="space-y-2">
              <Label htmlFor="skin_types">Skin types</Label>
              <TagInput
                id="skin_types"
                name="skin_types"
                defaultValue={product?.skin_types ?? []}
                suggestions={SKIN_TYPE_SUGGESTIONS}
                placeholder="Oily, dry, sensitive..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skin_concerns">Skin concerns</Label>
              <TagInput
                id="skin_concerns"
                name="skin_concerns"
                defaultValue={product?.skin_concerns ?? []}
                suggestions={SKIN_CONCERN_SUGGESTIONS}
                placeholder="Acne, dryness, brightening..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key_ingredients">Key ingredients</Label>
              <TagInput
                id="key_ingredients"
                name="key_ingredients"
                defaultValue={product?.key_ingredients ?? []}
                suggestions={INGREDIENT_SUGGESTIONS}
                placeholder="Niacinamide, Hyaluronic Acid..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Full ingredients list</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                rows={3}
                placeholder="Water, Glycerin, Niacinamide..."
                defaultValue={product?.ingredients ?? ""}
                className="bg-background/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="how_to_use">How to use</Label>
              <Textarea
                id="how_to_use"
                name="how_to_use"
                rows={3}
                placeholder="Apply a small amount to clean skin, morning and night."
                defaultValue={product?.how_to_use ?? ""}
                className="bg-background/60"
              />
            </div>
          </FormSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-primary/10 bg-card/60 p-4 sm:p-5">
            <h2 className="font-serif text-lg text-primary">Visibility</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Control how this product appears on the storefront.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/10 bg-background/50 px-3 py-2.5">
                <div>
                  <Label htmlFor="is_active">Active</Label>
                  <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                    Visible to shoppers
                  </p>
                </div>
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={product?.is_active ?? true}
                />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/10 bg-background/50 px-3 py-2.5">
                <div>
                  <Label htmlFor="is_featured">Featured</Label>
                  <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                    Highlight on the homepage
                  </p>
                </div>
                <Switch
                  id="is_featured"
                  name="is_featured"
                  defaultChecked={product?.is_featured ?? false}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="size-4" aria-hidden="true" />
              <p className="text-sm font-medium">Quick tips</p>
            </div>
            <ul className="mt-2 space-y-1.5 text-[0.7rem] leading-relaxed text-muted-foreground">
              <li>Add 2–3 key ingredients so shoppers can scan quickly.</li>
              <li>Keep the description short — one clear benefit works best.</li>
              <li>Stock of 5 or fewer is flagged on your dashboard.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-background/95 p-2.5 shadow-lg shadow-primary/5 backdrop-blur sm:px-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Back to products</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <ProductFormSubmit isEditing={Boolean(product)} />
      </div>
    </form>
  );
}
