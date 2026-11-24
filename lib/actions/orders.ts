"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function saveOrder(items: CheckoutItem[]) {
  if (items.length === 0) throw new Error("Cart is empty.");

  const supabase = await createClient();

  // Never trust prices sent from the browser — look them up in the catalog.
  const productIds = [...new Set(items.map((item) => item.productId))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds);

  if (productsError) throw new Error(productsError.message);

  const productById = new Map(
    (products ?? []).map((product) => [product.id, product])
  );

  if (productById.size !== productIds.length) {
    throw new Error("Some items in the cart are no longer available.");
  }

  const trustedItems = items.map((item) => {
    const product = productById.get(item.productId)!;
    const quantity = Math.max(1, Math.floor(item.quantity));

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    };
  });

  const totalAmount = trustedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: "WhatsApp order",
      customer_phone: "pending",
      status: "pending",
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (orderError) throw new Error(orderError.message);

  const orderItems = trustedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw new Error(itemsError.message);

  return order.id;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}