"use client";

import { CreateCollection } from "@/components/collections/create-collection";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { useUser } from "@clerk/nextjs";
import { NewCollection } from "@proemial/data/neon/schema";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";
import { addPaperToNewCollection } from "../(discover)/bookmark-paper";

export default function NewSpacePage() {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const queryParams = useSearchParams();
	const paperId = queryParams.get("paperId");

	if (!user || !paperId) {
		return null;
	}

	const { mutate: add } = useMutation({
		mutationFn: (collection: NewCollection) =>
			addPaperToNewCollection({ paperId, collection }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", user?.id],
			});
		},
	});

	return (
		<>
			<NavBar action={<CloseAction target={`${routes.space}/${user.id}`} />}>
				<SimpleHeader title="Create new space" />
			</NavBar>
			<Main>
				<CreateCollection
					noDialog
					collection={{ name: "", description: "", ownerId: user.id }}
					onSubmit={add}
				/>
			</Main>
		</>
	);
}
