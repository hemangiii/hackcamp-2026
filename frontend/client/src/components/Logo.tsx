export function Logo({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12.5c.3-.6-.2-1.3-.9-1.2-.9.1-1.3 1.1-1 1.9.5 1.2 2 1.5 3 .9 1.5-.9 1.6-3 .6-4.2-1.4-1.6-4-1.7-5.5-.3-1.9 1.7-1.9 4.8-.2 6.6 2.1 2.2 5.7 2.2 7.8.1 2.4-2.5 2.3-6.6-.2-9-2.9-2.7-7.5-2.6-10.2.2-3 3.2-2.8 8.3.3 11.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
