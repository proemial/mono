import { Button } from "@proemial/shadcn-ui";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@proemial/shadcn-ui/components/ui/dialog";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { usePostConsent } from "./use-post-consent";

type Props = {
	onClose: () => void;
};

export const ConsentDialogContent = ({ onClose }: Props) => {
	const { accept } = usePostConsent();

	const handleAccept = () => {
		accept();
		trackHandler(analyticsKeys.assistant.consent.accepted)();
		onClose();
	};
	const handleDeny = () => {
		trackHandler(analyticsKeys.assistant.consent.denied)();
		onClose();
	};

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Ready to share your first question?</DialogTitle>
			</DialogHeader>
			<div className="py-4">
				<p className="pb-2">
					All questions are <strong>public</strong> and will be attributed with
					your name and image.
				</p>
				<p className="text-sm text-gray-600">
					Don't want to share your questions with everyone else? Create a{" "}
					<a href="#" className="underline text-gray-800">
						private space
					</a>
					.
				</p>
			</div>

			<DialogFooter>
				<div className="flex flex-col sm:flex-row gap-2">
					<Button type="button" onClick={handleAccept}>
						Ask question now
					</Button>
					<Button variant="ghost" type="button" onClick={handleDeny}>
						Cancel
					</Button>
				</div>
			</DialogFooter>
		</DialogContent>
	);
};
