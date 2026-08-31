export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col px-5 pb-28 pt-8">{children}</div>
  );
}
