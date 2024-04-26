"use client";
import { sanitize } from "@proemial/utils/sanitizer";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

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
