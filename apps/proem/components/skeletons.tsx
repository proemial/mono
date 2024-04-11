import { Header5, Icons } from "@proemial/shadcn-ui";
import { FileSearch2 } from "lucide-react";

export function ChatPapersSkeleton({ statusText }: { statusText: string }) {
	return (
		<div className="flex items-center place-content-between">
			<div>
				<FileSearch2 className="size-5" />
			</div>
			<div className="flex items-center gap-2">
				<Header5>{statusText}</Header5>
				<Icons.throbber />
			</div>
		</div>
	);
}

export function ChatAnswerSkeleton() {
	return (
		<div className="flex items-center place-content-between">
			<div>
				<FileSearch2 className="size-5" />
			</div>
			<div className="flex items-center gap-2">
				<Header5>Retrieving answer</Header5>
				<Icons.throbber />
			</div>
		</div>
	);
}
