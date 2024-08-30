export function isEmbedded(pathname: string | undefined | null) {
	return pathname?.startsWith("/embed");
}
