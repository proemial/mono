import { Throbber } from "@/components/throbber";
import { routes } from "@/routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ReferenceList } from "./reference-list";

type Props = {
	params: {
		collectionId: string;
	};
	searchParams: {
		selected?: string;
	};
};

const InspectPage = async ({
	params: { collectionId },
	searchParams: { selected },
}: Props) => {
	if (!selected) {
		redirect(routes.home);
	}

	return (
		<Suspense
			fallback={
				<div className="flex justify-center">
					<Throbber />
				</div>
			}
		>
			<ReferenceList spaceId={collectionId} tuple={selected} />
		</Suspense>
	);
};

export default InspectPage;
