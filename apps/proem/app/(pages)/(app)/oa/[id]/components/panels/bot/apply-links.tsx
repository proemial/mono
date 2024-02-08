import Link from "next/link";
import React from "react";

const asLink = (content: string, href: string) => {
  return (
    <Link href={href} className="font-sans font-normal text-green-500">
      {content}
    </Link>
  );
};

/***
 * @deprecated reuse to applyLinks
 */
export function applyExplainLinks(
  msg: string,
  onClick: (concept: string) => void
): React.ReactNode {
  const re = /\(\(.*?\)\)/gi;

  const asPush = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        className="font-sans font-normal text-green-500 cursor-pointer"
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

export function applyLinks(message: string) {
  const arr = message
    .replace(aTaglinkCheckReqex, "~~$&~~")
    .replace(markdownlinkCheckReqex, "~~$&~~")
    .split("~~");

  // TODO?: Add better streaming support with partial rendering of styled a tags while it's streamed in
  return arr.map((messagePart, i) => {
    const [_fullATag, aTagHref, aTagContent] =
      aTaglinkCheckReqex.exec(messagePart) ?? [];

    const [_fullMarkdownLink, markdownContent, markdownHref] =
      markdownlinkCheckReqex.exec(messagePart) ?? [];

    const link: { href: string; content: string } | null =
      aTagHref && aTagContent
        ? {
            href: aTagHref.split("?")[0] as string,
            content: aTagContent,
          }
        : markdownHref && markdownContent
          ? {
              href: markdownHref.split("?")[0] as string,
              content: markdownContent,
            }
          : null;

    const content = link ? asLink(link.content, link.href) : messagePart;

    return (
      <span key={i} className="break-words">
        {content}
      </span>
    );
  });
}
