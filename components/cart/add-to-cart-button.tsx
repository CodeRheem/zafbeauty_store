"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function AddToCartButton({
  productId,
  name,
  price,
  imagePath,
  inStock,
}: {
  productId: string;
  name: string;
  price: number;
  imagePath: string | null;
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, name, price, imagePath }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-md border">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-2 hover:bg-secondary"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="p-2 hover:bg-secondary"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        size="lg"
        className="flex-1"
        disabled={!inStock}
        onClick={handleAdd}
      >
        {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
      </Button>
    </div>
  );
}