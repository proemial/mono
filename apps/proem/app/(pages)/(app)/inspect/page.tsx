import { Throbber } from "@/components/throbber";
import { routes } from "@/routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ReferenceList } from "../space/[collectionId]/inspect/reference-list";

type Props = {
	searchParams: {
		assistant?: string;
		tuple?: string;
	};
};

const InspectPage = async ({ searchParams: { assistant, tuple } }: Props) => {
	if (!tuple) {
		if (assistant === "true") {
			redirect(`${routes.home}?assistant=true`);
		} else {
			redirect(`${routes.home}`);
		}
	}

	return (
		<div className="flex flex-col gap-3 mt-6 mb-28">
			<Suspense
				fallback={
					<div className="flex justify-center">
						<Throbber />
					</div>
				}
			>
				<ReferenceList tuple={tuple} />
			</Suspense>
		</div>
	);
};

export default InspectPage;
