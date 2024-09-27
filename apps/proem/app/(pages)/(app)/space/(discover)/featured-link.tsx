"use client";

import { FC } from "react";
import Link from "next/link";
import { Star01 } from "@untitled-ui/icons-react";
import {
	trackHandler,
	analyticsKeys,
} from "@/components/analytics/tracking/tracking-keys";
import { useParams } from "next/navigation";

interface Item {
	title: string;
	date: string;
	image: string;
	url: string;
}

const FeaturedLink: FC<{ item: Item }> = ({ item }) => {
	const { collectionId: spaceId } = useParams<{ collectionId?: string }>();

	return (
		<div className="bg-[#9CC4C7] hover:shadow rounded-2xl">
			<Link
				href={spaceId ? `/space/${spaceId}${item.url}` : item.url}
				onClick={trackHandler(analyticsKeys.feed.cardFeatured.click)}
				prefetch={false}
			>
				<img src={item.image} alt={item.title} className="p-2 rounded-2xl" />
				<div className="p-3.5 h-full flex flex-col gap-2 justify-between">
					<div className="flex flex-col gap-3">
						<div>
							<div className="flex items-center justify-between gap-2 mb-1">
								<div className="flex items-center gap-2">
									<Star01 className="size-3.5" />
									<div className="uppercase text-2xs line-clamp-1">
										Featured paper
									</div>
								</div>
								<div className="flex items-center gap-2 ">
									<div className="uppercase text-2xs text-nowrap">
										{item.date}
									</div>
								</div>
							</div>
							<p className="text-lg">{item.title}</p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default FeaturedLink;
