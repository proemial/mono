import {
	Alert,
	AlertDescription,
	AlertTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@proemial/shadcn-ui";
import { AlertCircle } from "@untitled-ui/icons-react";

type Props = {
	error: Error | undefined;
};

export const LLMError = ({ error }: Props) => {
	if (!error) {
		return undefined;
	}

	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>
				<div className="flex flex-col gap-2">
					<p>
						An error occurred while generating your answer. Please try again
						later.
					</p>
					<Collapsible>
						<CollapsibleTrigger className="text-xs pb-2">
							Show details
						</CollapsibleTrigger>
						<CollapsibleContent>
							<pre className="text-xs overflow-auto text-wrap">
								{error.message}
							</pre>
						</CollapsibleContent>
					</Collapsible>
				</div>
			</AlertDescription>
		</Alert>
	);
};
