"use client";

import { useState } from "react";
import { saveProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");

  return (
    <form action={saveProduct} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Basic info</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Product name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <Select
            name="category_id"
            value={categoryId}
            onValueChange={(value) => setCategoryId(value ?? "")}
          >
            <SelectTrigger id="category_id">
              <SelectValue placeholder="Select a category">
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
            defaultValue={product?.description ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Product image</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
          <p className="text-xs text-muted-foreground">
            {product
              ? "Upload a new image to add it to this product's gallery."
              : "You can add more images after creating the product."}
          </p>
        </div>
      </section>

      {/* Pricing & stock */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Pricing &amp; stock</h2>

        <div className="grid grid-cols-2 gap-4">
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="compare_at_price">Compare-at price (optional)</Label>
            <Input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.compare_at_price ?? ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock quantity</Label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              min="0"
              defaultValue={product?.stock_quantity ?? 0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">Volume/size</Label>
            <Input
              id="volume"
              name="volume"
              placeholder="e.g. 50ml"
              defaultValue={product?.volume ?? ""}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              name="is_active"
              defaultChecked={product?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active (visible on storefront)</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_featured"
              name="is_featured"
              defaultChecked={product?.is_featured ?? false}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>
      </section>

      {/* Skincare details */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Skincare details</h2>

        <div className="space-y-2">
          <Label htmlFor="skin_types">
            Skin types (comma-separated: oily, dry, combination, sensitive, normal, all)
          </Label>
          <Input
            id="skin_types"
            name="skin_types"
            defaultValue={product?.skin_types?.join(", ")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skin_concerns">
            Skin concerns (comma-separated: acne, dryness, brightening, anti-aging...)
          </Label>
          <Input
            id="skin_concerns"
            name="skin_concerns"
            defaultValue={product?.skin_concerns?.join(", ")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="key_ingredients">
            Key ingredients (comma-separated, for filter chips)
          </Label>
          <Input
            id="key_ingredients"
            name="key_ingredients"
            placeholder="Niacinamide, Hyaluronic Acid"
            defaultValue={product?.key_ingredients?.join(", ")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredients">Full ingredients list</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            rows={3}
            defaultValue={product?.ingredients ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="how_to_use">How to use</Label>
          <Textarea
            id="how_to_use"
            name="how_to_use"
            rows={3}
            defaultValue={product?.how_to_use ?? ""}
          />
        </div>
      </section>

      <Button type="submit" size="lg">
        {product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}