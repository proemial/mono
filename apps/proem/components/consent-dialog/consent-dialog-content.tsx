import { Button } from "@proemial/shadcn-ui";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@proemial/shadcn-ui/components/ui/dialog";
import { usePostConsent } from "./use-post-consent";

type Props = {
	onClose: () => void;
};

export const ConsentDialogContent = ({ onClose }: Props) => {
	const { accept } = usePostConsent();

	const handleAccept = () => {
		accept();
		onClose();
	};
	const handleDeny = () => {
		onClose();
	};

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Ready to post your first question?</DialogTitle>
				<DialogDescription>
					We're excited too! Please be aware of the following:
				</DialogDescription>
			</DialogHeader>
			<div className="py-4">
				Unless you're a member of a registered organization, your questions and
				their associated answer, your name and profile image may be visible to
				other users of Proem.
			</div>
			<DialogFooter>
				<div className="flex flex-col sm:flex-row gap-2">
					<Button type="button" onClick={handleDeny}>
						Disagree
					</Button>
					<Button type="button" onClick={handleAccept}>
						Accept
					</Button>
				</div>
			</DialogFooter>
		</DialogContent>
	);
};
