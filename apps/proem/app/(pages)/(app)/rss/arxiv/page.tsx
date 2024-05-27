import { redirect } from "next/navigation";

export default function Page() {
	redirect("/rss/arxiv/cs.AI");

	return null;
}
