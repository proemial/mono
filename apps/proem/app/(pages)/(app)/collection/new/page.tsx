"use client";

import { useInternalUser } from "@/app/hooks/use-user";
import { CreateCollection } from "@/components/collections/create-collection";
import { Main } from "@/components/main";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { useUser } from "@clerk/nextjs";
import { NewCollection } from "@proemial/data/neon/schema";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";
import { addPaperToCollection } from "../../discover/bookmark-paper";

export default function NewCollectionPage() {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const { isInternal } = useInternalUser();
	const queryParams = useSearchParams();
	const paperId = queryParams.get("paperId");

	if (!user || !paperId) {
		return null;
	}

	const { mutate: add } = useMutation({
		mutationFn: (newCollection: NewCollection) =>
			addPaperToCollection({ paperId, collection: newCollection }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", user?.id],
			});
		},
	});

	return (
		<>
			<NavBarV2 action={<GoBackAction />} isInternalUser={isInternal}>
				<SimpleHeader title="Create new collection" />
			</NavBarV2>
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
