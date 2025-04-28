import { Header } from "@/app/(pages)/components/header";
import { Footer } from "../../../components/footer";
import ResearchPaper from "./components/paper";
import { BackButton } from "./components/back-button";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	return (
		<div className="w-full bg-white mx-auto max-w-[550px]">
			<div className="hidden max-[475px]:block min-[477px]:block sticky top-0 z-50">
				<Header />
			</div>
			<div className="p-2 min-h-[100vh]">
				<BackButton />
				<ResearchPaper id={params.id} />
			</div>
			<Footer />
		</div>
	);
}
