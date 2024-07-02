export function waitFor(millis: number) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(""), millis);
	});
}
