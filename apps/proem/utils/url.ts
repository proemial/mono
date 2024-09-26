import { routes } from "@/routes";

export function isEmbedded(pathname: string | undefined | null) {
	return pathname?.startsWith(routes.embed);
}

export function isPaperPage(pathname: string | undefined | null) {
	return pathname?.includes(routes.paper);
}
