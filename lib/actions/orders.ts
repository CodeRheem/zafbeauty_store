"use server";

import { createClient } from "@/lib/supabase/server";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function saveOrder(items: CheckoutItem[]) {
  const supabase = await createClient();

  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
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

  const orderItems = items.map((item) => ({
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