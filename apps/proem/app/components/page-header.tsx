import { Proem } from "./icons/brand/proem";
import { User } from "./icons/user/user";
import { MainMenuNew } from "./menu/menunew";

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-50 flex flex-row sticky top-0 justify-between border-b border-neutral-100/20 h-full font-normal tracking-normal p-6 text-lg shadow bg-background">
      <div className="flex flex-row gap-3">
        <Proem />
        {children}
      </div>
      <div className="flex flex-row">
        <MainMenuNew />
      </div>
    </div>

  );
}