import { getInternalUser } from "@/app/hooks/get-internal-user";
import { redirect } from "next/navigation";

type PageProps = {
	params?: {
		id: string;
	};
	// searchParams?: unknown;
};

export default async function ({ params }: PageProps) {
	const { isInternal } = getInternalUser();

	// TODO: Remove this check when launching feature
	if (!isInternal) {
		redirect("/");
	}

	return <div>Collection ID: {params?.id}</div>;
}
