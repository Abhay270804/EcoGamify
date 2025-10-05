export function CourseBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-white/70 px-2.5 py-1 text-xs font-medium text-foreground/80">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-primary"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
      {label}
    </span>
  );
}
