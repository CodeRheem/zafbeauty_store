export function PageLoading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 py-16"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex animate-in items-baseline gap-1.5 fade-in duration-500">
        <span className="font-logo text-xl italic text-primary">Zaf</span>
        <span className="text-[0.55rem] font-medium tracking-[0.32em] text-primary/70">
          BEAUTY
        </span>
      </div>

      <div className="relative h-[3px] w-40 overflow-hidden rounded-full bg-primary/10">
        <span className="zaf-loader-bar absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <span className="sr-only">Loading page</span>
    </div>
  );
}
