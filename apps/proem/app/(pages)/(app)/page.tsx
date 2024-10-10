import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function RootPage() {
	redirect(routes.space);
}
