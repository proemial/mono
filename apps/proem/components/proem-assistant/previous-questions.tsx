import { Header4, ScrollArea } from "@proemial/shadcn-ui";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { AssistantButton } from "./assistant-button";
import { Tuple, TuplePost } from "./tuple";
import { useLatestSubmitId } from "./use-latest-submit-id";
import { useSnapPointStore } from "./use-snap-point-store";

type Gradients = {
	top: boolean;
	bottom: boolean;
};

type Props = {
	posts: TuplePost[];
	userId: string | null | undefined;
	spaceId: string | undefined;
	paperId: string | undefined;
	height: number;
	expanded: boolean;
	setExpanded: (expanded: boolean) => void;
	onSubmit: (input: string) => void;
	onAbort: () => void;
	isLoading: boolean;
};

export const PreviousQuestions = ({
	posts,
	userId,
	spaceId,
	paperId,
	height,
	expanded,
	setExpanded,
	onSubmit,
	onAbort,
	isLoading,
}: Props) => {
	const scrollElement = useRef<HTMLDivElement>(null);
	const [gradients, setGradients] = useState<Gradients>({
		top: false,
		bottom: true,
	});
	const { snapPoint, setSnapPoint } = useSnapPointStore();
	const { id: submitId } = useLatestSubmitId();

	useEffect(() => {
		if (snapPoint !== 1.0) {
			setSnapPoint(1.0);
		}
	}, [snapPoint, setSnapPoint]);

	function handleSubmit(input: string) {
		onSubmit(input);
		scrollElement.current?.scrollTo({ top: 0, behavior: "instant" });
		setGradients((prev) => ({ ...prev, top: false }));
	}

	function handleScroll(this: HTMLDivElement, e: Event) {
		const target = e.target as HTMLDivElement;
		if (target.scrollTop <= 0) {
			// Top
			setGradients((prev) => ({ ...prev, top: false }));
		} else if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
			// Bottom
			setGradients((prev) => ({ ...prev, bottom: false }));
		} else {
			// Middle
			setGradients({ top: true, bottom: true });
			if (!expanded) {
				setExpanded(true);
			}
		}
	}

	function handleCollapse() {
		trackHandler(analyticsKeys.assistant.reactivate)();
		setExpanded(false);
		setGradients((prev) => ({ ...prev, bottom: true }));
	}

	useEffect(() => {
		scrollElement.current?.addEventListener("scroll", handleScroll, {
			capture: true,
		});
		return () => {
			scrollElement.current?.removeEventListener("scroll", handleScroll);
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: Handle if performance becomes an issue
	}, [handleScroll]);

	if (posts.length === 0) {
		return undefined;
	}

	return (
		<motion.div className="flex flex-col grow px-3 pb-3" animate={{ height }}>
			<Header4 className="text-white pb-2">Previous questions</Header4>
			<ScrollArea ref={scrollElement} className="grow">
				<motion.div
					className="pointer-events-none absolute left-0 right-0 top-0 h-20 bg-gradient-to-b from-theme-900 to-transparent z-10"
					animate={{ opacity: gradients.top ? 1 : 0 }}
				/>
				<motion.div
					className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-theme-900 to-transparent z-10"
					animate={{ opacity: gradients.bottom ? 1 : 0 }}
				/>
				<div className="space-y-2">
					{posts.map((post, index) => (
						<Tuple
							key={post.id}
							post={post}
							onSubmit={handleSubmit}
							onAbort={onAbort}
							highlight={
								typeof submitId !== "undefined" &&
								[spaceId, paperId].includes(submitId) &&
								index === 0
							}
							streaming={isLoading}
						/>
					))}
				</div>
			</ScrollArea>

			<motion.div
				className="fixed bottom-0 left-0 pt-5 h-[112px] w-full flex justify-center pointer-events-none z-20"
				animate={{
					opacity: expanded ? 1 : 0,
					marginBottom: expanded ? 0 : -112,
				}}
			>
				<AssistantButton onClick={handleCollapse} variant="light" />
			</motion.div>
		</motion.div>
	);
};
