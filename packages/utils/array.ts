// More utilities: https://medium.com/@dhaniNishant/creating-limit-skip-between-exclude-functions-for-javascript-arrays-4d60a75aaae7
export function limit<T>(array: T[], n: number, reverse = false): T[] {
	const data = reverse ? array.reverse() : array;
	return data.filter((x, i) => {
		if (i <= n - 1) {
			return true;
		}
	});
}
