export default function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
