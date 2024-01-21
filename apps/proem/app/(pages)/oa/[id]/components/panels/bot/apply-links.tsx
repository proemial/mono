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

export const linkCheckReqex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)">(.*?)<\/a>/g;

export function applyLinks(
  message: string,
  onClick: (concept: string) => void
) {
  const arr = message.replace(linkCheckReqex, "~~$&~~").split("~~");

  // TODO?: Add better streaming support with partial rendering of styled a tags while it's streamed in
  return arr.map((messagePart, i) => {
    const [_fullTag, href, innerContent] =
      linkCheckReqex.exec(messagePart) ?? [];
    const content =
      href && innerContent
        ? asLink(innerContent, () => onClick(href))
        : messagePart;

    return <span key={i}>{content}</span>;
  });
}
