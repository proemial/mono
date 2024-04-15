export const revalidate = 1;
export const metadata = {
	title: "proem - science answers",
};

type Props = {
	params: { shareId: string };
};

export default async function SharePage({ params: { shareId } }: Props) {
	return (
		<div>The primary factors contributing to global warming include emissions of greenhouse gases like carbon dioxide and methane from agriculture and the food system, along with air pollutants such as tropospheric ozone and black carbon from industrial activities. Reducing these emissions is key to mitigating global warming's impact.</div>
	);
}
