import React from "react";

type LinkOnClick = () => void;
const asLink = (content: string, onClickHandle: LinkOnClick) => {
  return (
    <span
      className="font-normal font-sans text-[#7DFA86] cursor-pointer"
      onClick={() => onClickHandle()}
    >
      {content}
    </span>
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

  const asLink = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        className="font-normal font-sans text-[#7DFA86] cursor-pointer"
        onClick={() => onClick(sanitized)}
      >
        {sanitized}
      </span>
    );
  };

  const arr = msg.replace(re, "~~$&~~").split("~~");
  return arr.map((s, i) => (
    <span key={i}>
      {s.match(re) ? <span>{s.match(re) ? asLink(s) : s}</span> : s}
    </span>
  ));
}

export const aTaglinkCheckReqex =
  /<a\s+(?:[^>]*?\s+)?href="([^"]*)">(.*?)<\/a>/g;
export const markdownlinkCheckReqex = /\[([^\]]+)\]\(([^)]+)\)/g;

export function applyLinks(
  message: string,
  onClick: (concept: string) => void
) {
  const arr = message.replace(aTaglinkCheckReqex, "~~$&~~").split("~~");

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

    const content = link
      ? asLink(link.content, () => onClick(link.href))
      : messagePart;

    return <span key={i}>{content}</span>;
  });
}
