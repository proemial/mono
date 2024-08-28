import { Throbber } from "@/components/throbber";
import { routes } from "@/routes";
import { Header4 } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DisableOverlayBackground } from "./disable-overlay-background";
import { ReferenceList } from "./reference-list";

type Props = {
	params: {
		collectionId: string;
	};
	searchParams: {
		assistant?: string;
		tuple?: string;
	};
};

const InspectPage = async ({
	params: { collectionId },
	searchParams: { assistant, tuple },
}: Props) => {
	if (!tuple) {
		if (assistant === "true") {
			redirect(`${routes.space}/${collectionId}?assistant=true`);
		} else {
			redirect(`${routes.space}/${collectionId}`);
		}
	}

	return (
		<div className="flex flex-col gap-3 mb-28">
			<DisableOverlayBackground />
			<Header4>Research references</Header4>
			<Suspense
				fallback={
					<div className="flex justify-center">
						<Throbber />
					</div>
				}
			>
				<ReferenceList spaceId={collectionId} tuple={tuple} />
			</Suspense>
		</div>
	);
};

export default InspectPage;
