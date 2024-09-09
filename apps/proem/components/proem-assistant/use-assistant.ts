import { routes } from "@/routes";
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

const ASSISTANT_SEARCH_PARAMS = {
	ASSISTANT: "assistant",
	TUPLE: "tuple",
};

export const useAssistant = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const { collectionId: spaceId } = useParams<{ collectionId?: string }>();

	const isOpen = useMemo(
		() => searchParams.get(ASSISTANT_SEARCH_PARAMS.ASSISTANT) === "true",
		[searchParams],
	);
	const slug = useMemo(
		() => searchParams.get(ASSISTANT_SEARCH_PARAMS.TUPLE) ?? undefined,
		[searchParams],
	);

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

	const open = useCallback(
		(slug?: string) => {
			const params = [
				{ name: ASSISTANT_SEARCH_PARAMS.ASSISTANT, value: "true" },
			];
			if (slug) {
				params.push({ name: ASSISTANT_SEARCH_PARAMS.TUPLE, value: slug });
			}
			const queryString = updateQueryString(params);
			if (slug && !pathname.includes("inspect")) {
				// Open inspect
				if (spaceId) {
					router.replace(`${routes.space}/${spaceId}/inspect?${queryString}`);
				} else {
					router.replace(`/inspect?${queryString}`);
				}
			} else {
				// Open assistant
				router.push(`${pathname}?${queryString}`);
			}
		},
		[pathname, router, updateQueryString, spaceId],
	);

	const deselectTuple = useCallback(() => {
		const params = [{ name: ASSISTANT_SEARCH_PARAMS.TUPLE, value: undefined }];
		const queryString = updateQueryString(params);
		router.replace(`${pathname}?${queryString}`);
	}, [pathname, router, updateQueryString]);

	const close = useCallback(() => {
		// Clear the assistant query params
		const params = [
			{ name: ASSISTANT_SEARCH_PARAMS.ASSISTANT, value: undefined },
		];
		const queryString = updateQueryString(params);
		router.replace(`${pathname}?${queryString}`);
	}, [pathname, router, updateQueryString]);

	return {
		isOpen,
		slug,
		open,
		close,
		deselectTuple,
	};
};
