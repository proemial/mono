import Link from "next/link";
import React from "react";

export function applyExplainLinks(
	msg: string,
	onClick: (concept: string) => void,
): React.ReactNode {
	const re = /\(\(.*?\)\)/gi;

	const asPush = (input: string) => {
		const sanitized = input.replace("((", "").replace("))", "");

		return (
			<span
				className="font-normal bg-neutral-200 dark:bg-neutral-600 cursor-pointer"
				onClick={() => onClick(sanitized)}
			>
				{sanitized}
			</span>
		);
	};

	const arr = msg.replace(re, "~~$&~~").split("~~");
	return arr.map((s, i) => (
		<span key={i}>
			{s.match(re) ? <span>{s.match(re) ? asPush(s) : s}</span> : s}
		</span>
	));
}

export const aTaglinkCheckReqex =
	/<a\s+(?:[^>]*?\s+)?href="([^"]*)">(.*?)<\/a>/g;
export const markdownlinkCheckReqex = /\[([^\]]+)\]\(([^)]+)\)/g;

function convertHrefToLink(fullHref: string) {
	const [href, title] = fullHref.split("?") as [string, string];

	return {
		href,
		title: decodeURIComponent(
			title?.replace("title=", "")?.replaceAll("+", " "),
		),
	};
}

type LinkType = { href: string; content: string; title: string };

export function applyElement(asElement: (link: LinkType) => React.ReactNode) {
	return function withAppliedElement(message: string) {
		const arr = message
			.replace(aTaglinkCheckReqex, "~~$&~~")
			.replace(markdownlinkCheckReqex, "~~$&~~")
			.split("~~");

		// TODO?: Add better streaming support with partial rendering of styled a tags while it's streamed in
		const test = arr.reduce(
			(acc, messagePart, i) => {
				const [_fullATag, aTagHref, aTagContent] =
					aTaglinkCheckReqex.exec(messagePart) ?? [];

				const [_fullMarkdownLink, markdownContent, markdownHref] =
					markdownlinkCheckReqex.exec(messagePart) ?? [];

				const link =
					aTagHref && aTagContent
						? {
								...convertHrefToLink(aTagHref),
								content: aTagContent,
							}
						: markdownHref && markdownContent
							? {
									...convertHrefToLink(markdownHref),
									content: markdownContent,
								}
							: null;

				if (link) {
					acc.links.push(link);
				}

				const content = link ? asElement(link) : messagePart;

				acc.content.push(
					<span key={i} className="break-words">
						{content}
					</span>,
				);
				return acc;
			},
			{ content: [], links: [] } as {
				content: JSX.Element[];
				links: LinkType[];
			},
		);
		return test;
	};
}

export const applyLinks = applyElement((link) => {
	return (
		<Link href={link.href} className="font-normal text-green-500">
			{link.content}
		</Link>
	);
});
export const applyLinksAsPills = applyElement((link) => {
	return (
		<Link href={link.href}>
			<span className="bg-green-100 text-green-800 text-xs font-medium me-1 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
				{link.content}
			</span>
		</Link>
	);
});
export const applyLinksAsSpans = applyElement((link) => {
	return <span tw="text-green-500 break-all">{link.content}</span>;
});
