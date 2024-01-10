import { Link, User } from "lucide-react";
import { Proem } from "./icons/brand/proem";

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 flex flex-row justify-between h-full p-6 text-lg font-normal tracking-normal border-b shadow border-neutral-100/20 bg-background">
      <div className="flex flex-row gap-3">
        <Proem />
        {children}
      </div>
      <div className="flex flex-row">
        <Link>
          <User />
        </Link>
      </div>
    </div>
  );
}
