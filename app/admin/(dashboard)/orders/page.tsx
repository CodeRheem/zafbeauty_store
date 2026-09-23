import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

type OrderItem = {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(id, product_name, unit_price, quantity, subtotal)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-primary">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Orders placed through the storefront
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Failed to load orders: {error.message}
        </p>
      )}

      {!error && (!orders || orders.length === 0) && (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          No orders yet.
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.order_items as unknown as OrderItem[];

            return (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 font-medium">
                      ₦{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>

                <div className="mt-4 space-y-1 border-t pt-3">
                  {items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-muted-foreground"
                    >
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span>₦{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}