import { usePathname } from "next/navigation";

export function useIsActive({ href }: { href: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/" && href === "/";

  return isHome || pathname.includes(href);
}
