"use client";
import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useVisualViewport } from "@/utils/useVisualViewport";
import { Collection } from "@proemial/data/neon/schema";
import { Button } from "@proemial/shadcn-ui";
import { ChevronRight } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Bookmarks } from "../space/(discover)/add-to-collection-button";
import { OptionalResult, findPapersAction } from "./find-papers";
import { Papers } from "./papers";

type Props = {
	bookmarks: Bookmarks;
	collectionId?: Collection["id"];
	searchQuery?: string;
	initialSearchResults?: OptionalResult;
};

export function SearchForm({
	bookmarks,
	collectionId,
	searchQuery,
	initialSearchResults,
}: Props) {
	const [state, formAction] = useFormState(
		findPapersAction,
		initialSearchResults,
	);
	const [isFocused, setIsFocused] = useState(false);

	const { keyboardUp } = useVisualViewport();
	useEffect(() => {
		if (!keyboardUp && !isFocused) {
			setIsFocused(false);
		}
	}, [keyboardUp, isFocused]);

	const handleSubmit = () => {
		trackHandler(`${analyticsKeys.search.submit.query}`)();
	};

	console.log("state", state);

	return (
		<>
			<form
				action={formAction}
				className="w-full"
				onSubmit={handleSubmit}
				autoComplete="off"
			>
				<FormInputs
					state={state}
					bookmarks={bookmarks}
					collectionId={collectionId}
					defaultValue={searchQuery ?? ""}
				/>
			</form>
		</>
	);
}

/**
 * This component must be inside the form component above for the
 * `useFormStatus` hook to work correctly.
 *
 * https://react.dev/reference/react-dom/hooks/useFormStatus
 */
function FormInputs({
	state,
	bookmarks,
	collectionId,
	defaultValue,
}: {
	state: OptionalResult;
	bookmarks: Bookmarks;
	collectionId?: Collection["id"];
	defaultValue: string;
}) {
	const { pending, data } = useFormStatus();
	const router = useRouter();

	useEffect(() => {
		// Update the URL query param when the search results are back
		if (data && pending) {
			const query = data.get("query");
			if (query) {
				router.replace(`?query=${encodeURIComponent(query.toString())}`);
			}
		}
	}, [data, pending, router]);

	return (
		<>
			<div className="flex items-center w-full border text-foreground bg-card border-background rounded-3xl">
				<div className="flex items-center w-full border text-foreground bg-card border-background rounded-3xl">
					<input
						name="query"
						defaultValue={defaultValue}
						placeholder="Search for a paper title or DOI"
						className="w-full h-12 pl-6 resize-none flex items-center text-lg bg-card placeholder:opacity-40 placeholder:text-[#2b2b2b] dark:placeholder:text-[#e5e5e5] rounded-l-3xl outline-none"
						maxLength={chatInputMaxLength}
						disabled={pending}
					/>
					<Button
						disabled={pending}
						className="size-8 w-[36px] bg-card mr-2 disabled:opacity-1"
						size="icon"
						type="submit"
						onClick={trackHandler(analyticsKeys.search.click.submit)}
					>
						<ChevronRight className="size-5" />
					</Button>
				</div>
			</div>

			<div className="mt-2">
				{pending && <div>Finding papers...</div>}

				{!pending && (
					<>
						{state?.results?.length === 0 && <div>0 papers found</div>}
						{state?.results && state.results.length > 0 && (
							<Papers
								papers={state.results}
								bookmarks={bookmarks}
								collectionId={collectionId}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
}
