"use client";

import {
	PaperReader,
	PaperReaderProps,
} from "@/app/(pages)/(app)/discover/[id]/paper-reader";
import { FullPageDrawerWithRouterNavigation } from "@/components/full-page-drawer";
import { useEffect, useState } from "react";

type ReaderModalProps = {
	params: { id: string };
};
export default function ReaderModal({
	params: { id: paperId },
}: ReaderModalProps) {
	// TODO!: ugly client side data fetching until we have a better solution
	const [readerData, setReaderData] = useState<PaperReaderProps | null>(null);

	useEffect(() => {
		const fetchCurrentPaper = async () => {
			const response = await fetch(`/discover/${paperId}/get`);
			const body = await response.json();
			setReaderData(body);
		};
		fetchCurrentPaper();
	}, [paperId]);

	return (
		<FullPageDrawerWithRouterNavigation>
			{readerData ? <PaperReader {...readerData} /> : <p>loading...</p>}
		</FullPageDrawerWithRouterNavigation>
	);
}
