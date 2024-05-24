"use client";

import { Icons } from "@proemial/shadcn-ui";
import Image from "next/image";
import { useQuery } from "react-query";
import { fetchPaperArt } from "./fetch-paper-art";

type Props = {
	paperId: string;
	generateOptions?: {
		paperTitle: string;
	};
};

export const PaperArt = ({ paperId, generateOptions }: Props) => {
	const { data, isLoading } = useQuery(`paper-art-${paperId}`, async () =>
		fetchPaperArt(paperId, generateOptions),
	);

	if (isLoading && generateOptions) {
		return <Spinner />;
	}

	if (!data) {
		return undefined;
	}

	return (
		<Image
			src={data}
			alt="Paper Art"
			width={704}
			height={320}
			className="rounded-xl drop-shadow"
		/>
	);
};

function Spinner() {
	return (
		<div className="flex items-center justify-center mx-auto size-24">
			<Icons.loader />
		</div>
	);
}
