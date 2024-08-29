import { Throbber } from "@/components/throbber";
import { routes } from "@/routes";
import { Header4 } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DisableOverlayBackground } from "../space/[collectionId]/inspect/disable-overlay-background";
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
		<div className="flex flex-col gap-3 mb-28">
			<DisableOverlayBackground />
			<Header4>Papers referenced in answer</Header4>
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
