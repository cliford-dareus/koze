export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell-auth relative min-h-[70vh] px-4 py-8 sm:py-12">
      <div
        className="lang-wash pointer-events-none absolute inset-0 opacity-15"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
