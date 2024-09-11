export const asInfiniteQueryData = <T>(data: T, initialPageParam = 1) => {
	return {
		pages: [data],
		pageParams: [initialPageParam],
	};
};
