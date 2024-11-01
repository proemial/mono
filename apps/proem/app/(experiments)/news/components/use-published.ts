import { useSearchParams } from "next/navigation";

export const usePublishedSearchParam = () => {
	const searchParams = useSearchParams();
	return { publishedParam: searchParams.get("p") === "1" };
};
