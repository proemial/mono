import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const ASSISTANT_SEARCH_PARAMS = {
	ASSISTANT: "assistant",
	TUPLE: "tuple",
};

export const useAssistant = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const isOpen = searchParams.get(ASSISTANT_SEARCH_PARAMS.ASSISTANT) === "true";
	const answerSlug =
		searchParams.get(ASSISTANT_SEARCH_PARAMS.TUPLE) ?? undefined;

	const updateQueryString = useCallback(
		(params: { name: string; value: string | undefined }[]) => {
			const existingParams = new URLSearchParams(searchParams.toString());
			for (const { name, value } of params) {
				if (value) {
					existingParams.set(name, value);
				} else {
					if (existingParams.has(name)) {
						existingParams.delete(name);
					}
				}
			}
			return existingParams.toString();
		},
		[searchParams],
	);

	const open = (answerSlug?: string) => {
		const params = [{ name: ASSISTANT_SEARCH_PARAMS.ASSISTANT, value: "true" }];
		if (answerSlug) {
			params.push({ name: ASSISTANT_SEARCH_PARAMS.TUPLE, value: answerSlug });
		}
		const queryString = updateQueryString(params);
		router.push(`${pathname}?${queryString}`);
	};

	const close = () => {
		// Clear the assistant query params
		const params = [
			{ name: ASSISTANT_SEARCH_PARAMS.ASSISTANT, value: undefined },
			{ name: ASSISTANT_SEARCH_PARAMS.TUPLE, value: undefined },
		];
		const queryString = updateQueryString(params);
		router.push(`${pathname}?${queryString}`);
	};

	return {
		isOpen,
		answerSlug,
		open,
		close,
	};
};
