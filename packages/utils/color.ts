export function hex2rgba(hex: string, alpha = 1) {
	const [r, g, b] =
		hex?.match(/\w\w/g)?.map((x) => Number.parseInt(x, 16)) ?? [];
	return `rgba(${r},${g},${b},${alpha})`;
}
