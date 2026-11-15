import { Fragment, type ReactNode } from "react";
import { Reveal } from "@/components/landing/reveal";
import { RotatingSeal } from "@/components/landing/rotating-seal";
import { cn } from "@/lib/utils";

export function EditorialHeader({
  eyebrow,
  title,
  description,
  meta,
  seal = false,
  compact = false,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode[];
  seal?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-primary/10",
        className
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(110%_120%_at_88%_-10%,var(--color-secondary)_0%,transparent_58%),radial-gradient(85%_80%_at_-5%_110%,var(--color-muted)_0%,transparent_60%)]" />
        <div className="absolute -right-24 -top-28 size-72 rounded-full border border-primary/15 sm:size-96" />
        <div className="absolute -right-10 top-1/2 hidden size-[30rem] -translate-y-1/2 rounded-full border border-primary/10 lg:block" />
        <span className="pointer-events-none absolute right-6 top-4 select-none font-logo text-[10rem] italic leading-none text-primary/[0.05] sm:hidden">
          z
        </span>
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between",
          compact ? "py-9 sm:py-12" : "py-10 sm:py-14"
        )}
      >
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-3 text-[0.58rem] font-medium uppercase tracking-[0.26em] text-primary/70 sm:text-[0.6rem] sm:tracking-[0.32em]">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.08} y={22}>
            <h1
              className={cn(
                "mt-4 break-words font-serif leading-[1.04] text-primary",
                compact
                  ? "text-[2rem] sm:text-4xl lg:text-[2.9rem]"
                  : "text-[2.2rem] sm:text-5xl lg:text-[3.6rem]"
              )}
            >
              {title}
            </h1>
          </Reveal>

          {description && (
            <Reveal delay={0.16}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
                {description}
              </p>
            </Reveal>
          )}

          {meta && meta.length > 0 && (
            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.58rem] font-medium uppercase tracking-[0.24em] text-primary/60 sm:text-[0.62rem]">
                {meta.map((item, index) => (
                  <Fragment key={index}>
                    {index > 0 && (
                      <span
                        className="size-1 rounded-full bg-primary/30"
                        aria-hidden="true"
                      />
                    )}
                    <span>{item}</span>
                  </Fragment>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {seal && (
          <div className="hidden shrink-0 lg:block">
            <Reveal delay={0.22} y={0}>
              <RotatingSeal compact />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
