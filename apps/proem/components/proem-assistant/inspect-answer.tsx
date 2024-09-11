import { useDisableOverlayBackground } from "@/app/(pages)/(app)/space/[collectionId]/inspect/use-disable-overlay-background";
import { routes } from "@/routes";
import { Header4 } from "@proemial/shadcn-ui";
import { ChevronLeft, X } from "@untitled-ui/icons-react";
import { useParams, useRouter } from "next/navigation";
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
	const [{ assistant }, setAssistant] = useAssistant();
	const [ref, { height }] = useMeasure();
	const { snapPoint, setSnapPoint } = useSnapPointStore();
	useDisableOverlayBackground();
	const { collectionId: spaceId } = useParams<{ collectionId?: string }>();
	const router = useRouter();

	useEffect(() => {
		const windowHeight = window.innerHeight;
		if (height && windowHeight) {
			const assistantHeight = (height + 24 + 18) / windowHeight;
			if (snapPoint !== assistantHeight && assistant) {
				setSnapPoint(assistantHeight);
			}
		}
	});

	const handleBack = () => {
		if (spaceId) {
			router.push(`${routes.space}/${spaceId}`);
		} else {
			router.push(routes.space);
		}
	};

	return (
		<div ref={ref} className="flex flex-col px-3 mb-4">
			<div className="flex justify-between -mt-4 -mx-2 text-white">
				<div
					className="p-2 rounded-full hover:opacity-75 duration-200 cursor-pointer"
					onClick={handleBack}
				>
					<ChevronLeft className="size-6" />
				</div>
				<div
					className="p-2 rounded-full hover:opacity-75 duration-200 cursor-pointer"
					onClick={() => setAssistant({ assistant: false })}
				>
					<X className="size-6" />
				</div>
			</div>
			<Header4 className="text-white mb-1">Review references</Header4>
			<Tuple post={tuple} onSubmit={() => undefined} />
			<div className="pt-3 pb-1 text-center">
				<AssistantButton
					onClick={() => setAssistant({ selected: "" })}
					variant="light"
				/>
			</div>
		</div>
	);
};
