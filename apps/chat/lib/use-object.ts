import { useEffect, useState } from "react";

type Result<T> = { data?: T; isLoading: boolean };

// Inspired by https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-object
// Simplified using generics and built to support evolving objects
export function useObject<T>(url: string): Result<T> {
	const [data, setData] = useState<T>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const response = await fetch(url, { method: "POST" });
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			while (reader && true) {
				const { done, value } = await reader.read();
				if (done) {
					setIsLoading(false);
					break;
				}
				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");
				lines.forEach((line) => {
					if (line) {
						const data = JSON.parse(line);
						setData(data);
					}
				});
			}
		};

		fetchData();
	}, [url]);

	return { data, isLoading };
}
