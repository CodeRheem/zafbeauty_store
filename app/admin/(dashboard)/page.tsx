import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, stock_quantity, is_active, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-primary">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your Zaf Beauty catalog
          </p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants()}>
          Add product
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Failed to load products: {error.message}
        </p>
      )}

      {!error && (!products || products.length === 0) && (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Add your first product
          </Link>
        </div>
      )}

      {products && products.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {(product.categories as unknown as { name: string } | null)
                    ?.name ?? "—"}
                </TableCell>
                <TableCell>₦{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}