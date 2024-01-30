"use client";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { sanitize } from "@proemial/utils/sanitizer";

export default function Markdown({ children }: { children: string }) {
  const { sanitized } = sanitize(children);
  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {sanitized as string}
      </ReactMarkdown>
    </>
  );
}
