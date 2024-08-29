export function isArxivPaperId(paperId: string): boolean {
	// Check if the paperId does not start with "W" (case-insensitive)
	return !paperId.toLowerCase().startsWith("w");
}
