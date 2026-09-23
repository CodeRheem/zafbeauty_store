const WHATSAPP_NUMBER = "2348052378401";

export function getProductImageUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/public_images/${storagePath}`;
}

export function buildWhatsAppOrderLink(items: {
  name: string;
  quantity: number;
  price: number;
}[]): string {
  const lines = items.map(
    (item) =>
      `- ${item.name} x${item.quantity} — ₦${(
        item.price * item.quantity
      ).toLocaleString()}`
  );
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const message = [
    "Hi Zaf Beauty! I'd like to order:",
    "",
    ...lines,
    "",
    `Total: ₦${total.toLocaleString()}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

export function buildWhatsAppSingleProductLink(productName: string): string {
  const message = `Hi Zaf Beauty! I'm interested in ${productName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}