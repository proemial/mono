import { useSearchParams } from "next/navigation";

export const useFromFeedSearchParam = () => {
	const searchParams = useSearchParams();
	return { fromFeedParam: searchParams.get("f") === "1" };
};
