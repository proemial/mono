import { Header4 } from "@proemial/shadcn-ui";
import { ChevronLeft, X } from "@untitled-ui/icons-react";
import { useEffect } from "react";
import useMeasure from "react-use-measure";
import { AssistantButton } from "./assistant-button";
import { Tuple, TuplePost } from "./tuple";
import { useAssistant } from "./use-assistant";
import { useSnapPointStore } from "./use-snap-point-store";

type Props = {
	tuple: TuplePost;
};

export const InspectAnswer = ({ tuple }: Props) => {
	const { isOpen, close, deselectTuple } = useAssistant();
	const [ref, { height }] = useMeasure();
	const { snapPoint, setSnapPoint } = useSnapPointStore();

	useEffect(() => {
		const windowHeight = window.innerHeight;
		if (height && windowHeight) {
			const assistantHeight = (height + 24 + 18) / windowHeight;
			if (snapPoint !== assistantHeight && isOpen) {
				setSnapPoint(assistantHeight);
			}
		}
	});

	return (
		<div ref={ref} className="flex flex-col px-3 mb-4">
			<div className="flex justify-between -mt-4 -mx-2 text-white">
				<div
					className="p-2 rounded-full hover:opacity-75 duration-200 cursor-pointer"
					onClick={() => deselectTuple()}
				>
					<ChevronLeft className="size-6" />
				</div>
				<div
					className="p-2 rounded-full hover:opacity-75 duration-200 cursor-pointer"
					onClick={() => close()}
				>
					<X className="size-6" />
				</div>
			</div>
			<Header4 className="text-white">Review references</Header4>
			<Tuple post={tuple} onSubmit={() => undefined} />
			<div className="pt-3 pb-1 text-center">
				<AssistantButton onClick={() => deselectTuple()} variant="light" />
			</div>
		</div>
	);
};
