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
				className="font-normal text-green-500 cursor-pointer"
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
		title: decodeURIComponent(title?.replace("title=", "")?.replaceAll("+", " ")),
	};
}

type Link = { href: string; content: string; title: string };

export function applyElement(asElement: (link: Link) => React.ReactNode) {
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
				links: Link[];
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
export const applyLinksAsSpans = applyElement((link) => {
	return <span tw="text-green-500 break-all">{link.content}</span>;
});
