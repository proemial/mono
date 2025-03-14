// More utilities: https://medium.com/@dhaniNishant/creating-limit-skip-between-exclude-functions-for-javascript-arrays-4d60a75aaae7
export function limit<T>(array: T[], n: number, reverse = false): T[] {
	const data = reverse ? [...array].reverse() : array;
	return data.filter((x, i) => {
		if (i <= n - 1) {
			return true;
		}
	});
}

export function shuffle<T>(array: T[]): T[] {
	return array.sort(() => Math.random() - 0.5);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function onLast(index: number, items: any[], styling: string) {
	if (index < items.length - 1) {
		return styling;
	}
	return "";
}

export function randomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)] as T;
}
