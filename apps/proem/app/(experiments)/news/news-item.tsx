import { Button } from "@proemial/shadcn-ui";
import { ArrowUp } from "@untitled-ui/icons-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import { Gravatar } from "./gravatar";
import staticNewsItems from "./static-news-items.json";
import Link from "next/link";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

type Props = {
	item: (typeof staticNewsItems)[number] | undefined;
	children: ReactNode;
};

export const NewsItem = ({ item, children }: Props) => {
	if (!item) {
		return undefined;
	}

	const upvotes = useMemo(() => {
		return Math.floor(Math.random() * 100) ?? 1;
	}, []);

	return (
		<div className="flex flex-col gap-3 py-3 bg-theme-100 rounded-lg">
			{/* Header */}
			<div className="flex gap-2 justify-between px-3">
				<div className="flex gap-2 items-center">
					<Image
						src={Gravatar.getGravatarURL(item.author.email)}
						alt={item.author.name}
						width={28}
						height={28}
						className="rounded-full drop-shadow-sm"
					/>
					<div className="font-semibold">{item.author.name}</div>
				</div>
				<div className="opacity-50 text-sm">
					{dayjs(item.timestamp).fromNow()}
				</div>
			</div>
			{/* Highlighted item */}
			<div className="px-3">{children}</div>
			{/* News source */}
			<div className="px-3">
				<Link href={item.article.url} target="_blank">
					<div className="flex rounded-lg overflow-hidden hover:drop-shadow-lg duration-100">
						<Image
							src={item.article.ogImage}
							alt="Article image"
							width={150}
							height={150}
							className="aspect-square object-cover"
						/>
						<div className="flex flex-col gap-2 justify-between p-3 bg-theme-800 text-white">
							<div className="text-lg font-semibold leading-tight">
								{item.article.title}
							</div>
							<div className="flex flex-col gap-0.5 text-sm opacity-75">
								<div>Article on {item.article.source}</div>
								<div className="flex gap-1.5">
									<span>{item.article.author.name}</span>
									<span>·</span>
									<span>{dayjs(item.article.timestamp).format("LL")}</span>
								</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
			{/* Buttons */}
			<div className="flex gap-2 px-3">
				<Button className="flex gap-2 items-center hover:bg-theme-500 active:bg-theme-600">
					<ArrowUp className="size-4" />
					<span className="font-semibold">{upvotes}</span>
				</Button>
				<Button className="font-semibold hover:bg-theme-500 active:bg-theme-600">
					Share
				</Button>
			</div>
		</div>
	);
};
