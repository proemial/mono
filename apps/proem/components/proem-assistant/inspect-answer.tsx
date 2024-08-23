import { Header4 } from "@proemial/shadcn-ui";
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
	const { deselectTuple } = useAssistant();
	const [ref, { height }] = useMeasure();
	const { snapPoint, setSnapPoint } = useSnapPointStore();

	useEffect(() => {
		const windowHeight = window.innerHeight;
		if (height && windowHeight) {
			const assistantHeight = (height + 24) / windowHeight;
			if (snapPoint !== assistantHeight) {
				setSnapPoint(assistantHeight);
			}
		}
	});

	return (
		<div ref={ref} className="flex flex-col p-3">
			<Header4 className="text-white">Inspect answer</Header4>
			<Tuple post={tuple} onSubmit={() => undefined} />
			<div className="pt-3 pb-1 text-center">
				<AssistantButton onClick={() => deselectTuple()} variant="light" />
			</div>
		</div>
	);
};
