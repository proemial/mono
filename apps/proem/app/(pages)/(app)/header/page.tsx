import { Theme } from "@/components/theme";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";

type Params = {
	searchParams?: {
		title?: string;
	};
};

// This is just a test page for testing our headers, based on various seed titles
export default async function HeaderTestPage({ searchParams }: Params) {
	const pageTitle =
		searchParams?.title ??
		"OrthodonticQA models achieve 87.72% accuracy on dental literature questions, proving their value for critical appraisal";

	return (
		<div>
			<Theme.header title={pageTitle}>
				<NavBar action={<div className="w-8" />}>
					<SimpleHeader title="Infectious Immunology" />
				</NavBar>
			</Theme.header>

			<div className="mb-4">
				<h1>
					Future forest growth threatens butterfly species, predicting habitat
					declines of 41%, 47%, and 65% for three threatened species.
				</h1>
				The researchers looked at how three types of endangered butterflies cope
				with changes in their grassland homes as forests grow over them. They
				studied Marsh Fritillary, Apollo, and Large Blue butterflies on the
				Island of Gotland from 2017 to 2020. They found that these butterflies
				don't like too much forest or lack of variety in their habitats. If
				things keep changing, the butterflies could lose a big portion of their
				living space. By managing the environment smartly, we can help protect
				these butterflies and keep the landscape diverse and rich.
			</div>
		</div>
	);
}
