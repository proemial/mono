import { routes } from "@/routes";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const rootDomain = ["www", "proem", "127", "192", "10", "localhost:4242"];

export default async function RootPage({
	searchParams,
}: {
	searchParams: URLSearchParams;
}) {
	const host = headers().get("host") || "";
	const subdomain = host.split(".")[0];

	if (subdomain && !rootDomain.includes(subdomain)) {
		if (subdomain === "spaces") {
			redirect(routes.space);
		}
		redirect(`/${subdomain}?${searchParams.toString()}`);
	}

	redirect(routes.ask);
}
