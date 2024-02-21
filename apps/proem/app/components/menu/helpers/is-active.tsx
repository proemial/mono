import { usePathname } from "next/navigation";

export function useIsActive({ href }: { href: string }) {
	const pathname = usePathname();

	return pathname === href || (href !== "/" && pathname.includes(href));
}
