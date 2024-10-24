import Image from "next/image";
import staticNewsItems from "./static-news-items.json";
import { Gravatar } from "./gravatar";
import Link from "next/link";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

type Props = {
	item: (typeof staticNewsItems)[number] | undefined;
};

export const QAItem = ({ item }: Props) => {
	if (!item) {
		return undefined;
	}

	const {
		highlights: { qaIndex, sourceIndex, sourceAuthor },
	} = item;

	return (
		<div className="flex flex-col gap-3">
			<div className="text-xl font-semibold">
				{item.annotations.qa[qaIndex]?.question}
			</div>
			<div className="flex flex-col gap-2">
				<Trackable
					trackingKey={analyticsKeys.experiments.news.clickAnswer}
					properties={
						item.annotations.qa[qaIndex]?.answer
							? { answer: item.annotations.qa[qaIndex].answer }
							: undefined
					}
				>
					<Link
						href={`/paper/oa/${item.annotations.sources[sourceIndex]?.id.replace("https://openalex.org/", "")}`}
						target="_blank"
					>
						<div className="border-l-2 border-theme-500 pl-3 py-1 hover:bg-theme-500 hover:rounded-lg duration-100">
							{item.annotations.qa[qaIndex]?.answer}
						</div>
					</Link>
				</Trackable>
				<div className="flex gap-2 items-center pl-3.5">
					<Image
						src={
							sourceAuthor.localImageUrl ??
							Gravatar.getGravatarURL(sourceAuthor.email)
						}
						alt={sourceAuthor.name}
						width={24}
						height={24}
						className="rounded-full drop-shadow-sm object-cover aspect-square"
					/>
					<div className="flex gap-1 items-center">
						<div>{sourceAuthor.name}</div>
						<div className="opacity-50">@ {sourceAuthor.affiliation}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
