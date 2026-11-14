import { cn } from "@/lib/utils";

export function RotatingSeal({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const ringId = compact ? "seal-ring-compact" : "seal-ring";
  return (
    <div
      className={cn(
        "seal-float relative flex items-center justify-center",
        compact ? "size-36" : "size-56",
        className
      )}
    >
      <span className="absolute inset-0 rounded-full border border-primary/15" />
      <span
        className={cn(
          "absolute rounded-full border border-dashed border-primary/20",
          compact ? "inset-3" : "inset-4"
        )}
      />

      <svg
        viewBox="0 0 200 200"
        className="seal-spin absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <path
            id={ringId}
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          fill="currentColor"
          className="text-primary/55"
          fontSize={compact ? 8 : 9}
          letterSpacing={compact ? 4.2 : 4.6}
        >
          <textPath href={`#${ringId}`} startOffset="0">
            CLEAN · CONSIDERED · RADIANT · EVERYDAY ·
          </textPath>
        </text>
      </svg>

      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-background/70 shadow-sm backdrop-blur",
          compact ? "size-16" : "size-24"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className={compact ? "size-7" : "size-10"}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21 C 12 15, 12 9, 16.5 3"
            stroke="var(--color-primary)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M12.5 13.5 C 8.5 13.5, 5.5 11, 4.5 7 C 8.5 7, 11.5 9, 12.5 13.5"
            stroke="var(--color-primary)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 9.5 C 14.5 5.5, 16.5 2.5, 20 1 C 20 5, 18 8, 14.5 9.5"
            stroke="var(--color-primary)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
