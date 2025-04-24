"use client";
import { sanitize } from "@proemial/utils/sanitizer";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
	const { sanitized } = sanitize(children);

	// Wrap in "not-prose" to avoid global margins of child P tags
	return (
		<div className="not-prose">
			<ReactMarkdown
				remarkPlugins={[remarkMath, remarkGfm]}
				rehypePlugins={[rehypeKatex, rehypeRaw]}
			>
				{sanitized as string}
			</ReactMarkdown>
		</div>
	);
}
