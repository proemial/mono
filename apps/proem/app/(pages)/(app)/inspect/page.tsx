import { Throbber } from "@/components/throbber";
import { routes } from "@/routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ReferenceList } from "../space/[collectionId]/inspect/reference-list";

type Props = {
	searchParams: {
		selected?: string;
	};
};

const InspectPage = async ({ searchParams: { selected } }: Props) => {
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
			<ReferenceList tuple={selected} />
		</Suspense>
	);
};

export default InspectPage;
