import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
	const { userId } = auth();
	if (userId) {
		redirect(`${routes.space}/${userId}`);
	} else {
		// TODO: Should redirect to feed (maybe `/space`)
		redirect(routes.discover);
	}
}
