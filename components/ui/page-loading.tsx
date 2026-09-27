import { LoaderCircle } from "lucide-react";

export function PageLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading page">
      <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
