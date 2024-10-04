import { SearchForm } from "./components/search-form";
import { cookies } from "next/headers";

export default function Home() {
	const cookieStore = cookies();
	const cookie = cookieStore.get("search-input");
	const searchInput =
		cookie && (JSON.parse(cookie.value) as Record<string, string>);

	return (
		<div>
			<SearchForm searchInput={searchInput} />
		</div>
	);
}
