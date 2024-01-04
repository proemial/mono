export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 h-full px-4 py-6 text-xl shadow bg-background">
      {children}
    </div>
  );
}
