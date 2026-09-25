import { SiteLoader } from "@/components/site-loader";

export default function Loading() {
  return (
    <div className="relative min-h-[50vh]">
      <SiteLoader label="LOADING ADMIN" />
    </div>
  );
}
