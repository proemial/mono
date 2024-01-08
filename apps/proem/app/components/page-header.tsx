import { Proem } from "./icons/brand/proem";

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row sticky top-0 gap-3 border-b border-neutral-100/20 h-full font-normal tracking-normal p-6 text-lg shadow bg-background">
      <Proem />
      {children}
    </div>

  );
}