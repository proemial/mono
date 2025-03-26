"use client";
import { useRef, useEffect, useCallback } from "react";

export const JSONHighlighter = ({
	value,
	onChange,
}: { value: string; onChange: (value: string) => void }) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const lastCaretPosition = useRef<number>(0);
	const isEditing = useRef<boolean>(false);
	const historyRef = useRef<string[]>([value]);
	const historyIndexRef = useRef<number>(0);

	const formatJSON = useCallback((text: string) => {
		try {
			const parsed = JSON.parse(text);
			return JSON.stringify(parsed, null, 2);
		} catch (e) {
			return text;
		}
	}, []);

	const highlightJSON = useCallback((text: string) => {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(
				/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
				(match) => {
					let cls = "text-gray-800";
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = "text-blue-600 font-semibold";
						} else {
							cls = "text-green-600";
						}
					} else if (/true|false/.test(match)) {
						cls = "text-purple-600";
					} else if (/null/.test(match)) {
						cls = "text-gray-600";
					} else {
						cls = "text-orange-600";
					}
					return `<span class="${cls}">${match}</span>`;
				},
			);
	}, []);

	// Save cursor position
	const saveCaretPosition = useCallback(() => {
		if (contentRef.current) {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(contentRef.current);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				lastCaretPosition.current = preCaretRange.toString().length;
			}
		}
	}, []);

	// Restore cursor position
	const restoreCaretPosition = useCallback(() => {
		if (contentRef.current) {
			const selection = window.getSelection();
			if (selection) {
				const pos = lastCaretPosition.current;
				const charIndex = findCharacterIndex(contentRef.current, pos);

				if (charIndex) {
					selection.removeAllRanges();
					const range = document.createRange();
					range.setStart(charIndex.node, charIndex.position);
					range.collapse(true);
					selection.addRange(range);
				}
			}
		}
	}, []);

	// Find position in node to place cursor
	const findCharacterIndex = (root: Node, targetIndex: number) => {
		const treeWalker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT,
			null,
		);

		let charIndex = 0;
		let currentNode = treeWalker.nextNode();

		while (currentNode) {
			const nodeLength = currentNode.nodeValue?.length || 0;

			if (charIndex + nodeLength >= targetIndex) {
				return {
					node: currentNode,
					position: targetIndex - charIndex,
				};
			}

			charIndex += nodeLength;
			currentNode = treeWalker.nextNode();
		}

		return null;
	};

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			saveCaretPosition();

			// Handle Cmd+Z or Ctrl+Z
			if ((e.metaKey || e.ctrlKey) && e.key === "z") {
				e.preventDefault();

				if (historyIndexRef.current > 0) {
					isEditing.current = true;
					historyIndexRef.current--;

					const previousValue = historyRef.current[historyIndexRef.current];

					if (contentRef.current && inputRef.current) {
						contentRef.current.innerHTML = highlightJSON(previousValue);
						inputRef.current.value = previousValue;
						onChange(previousValue);
					}

					setTimeout(() => {
						isEditing.current = false;
					}, 0);
				}
			}
		},
		[saveCaretPosition, highlightJSON, onChange],
	);

	useEffect(() => {
		if (contentRef.current && !isEditing.current) {
			const formatted = formatJSON(value);
			contentRef.current.innerHTML = highlightJSON(formatted);
		}
	}, [value, formatJSON, highlightJSON]);

	const handleInput = () => {
		if (contentRef.current && inputRef.current) {
			isEditing.current = true;
			saveCaretPosition();

			const text = contentRef.current.innerText;
			const formatted = formatJSON(text);
			inputRef.current.value = formatted;
			onChange(formatted);

			// Add to history
			historyRef.current = [
				...historyRef.current.slice(0, historyIndexRef.current + 1),
				formatted,
			];
			historyIndexRef.current = historyRef.current.length - 1;

			// Limit history size (optional)
			if (historyRef.current.length > 50) {
				historyRef.current = historyRef.current.slice(
					historyRef.current.length - 50,
				);
				historyIndexRef.current = historyRef.current.length - 1;
			}

			// Update without triggering the useEffect
			if (contentRef.current) {
				contentRef.current.innerHTML = highlightJSON(formatted);
				restoreCaretPosition();
			}

			setTimeout(() => {
				isEditing.current = false;
			}, 0);
		}
	};

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="hidden"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<div
				ref={contentRef}
				contentEditable
				onInput={handleInput}
				onBlur={() => {
					isEditing.current = false;
				}}
				onKeyDown={handleKeyDown}
				onMouseUp={saveCaretPosition}
				className="min-h-[200px] w-full p-3 border rounded-md font-mono text-sm whitespace-pre-wrap break-words"
				style={{ tabSize: 2 }}
			/>
		</div>
	);
};
