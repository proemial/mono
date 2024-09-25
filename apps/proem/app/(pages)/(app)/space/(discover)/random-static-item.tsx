import { Star01 } from "@untitled-ui/icons-react";

interface Item {
	title: string;
	date: string;
	image: string;
	url: string;
}

// This function runs on the server.
async function getRandomItem(): Promise<Item> {
	const items: Item[] = [
		{
			title:
				"Chubby-cheeked babies trigger stronger nurturing instincts in women with low oxytocin gene methylation.",
			date: "3 months ago",
			image: "/featured-images/W4400380733.jpg",
			url: "/paper/oa/W4400380733",
		},
		{
			title:
				"COVID-19 lockdowns accelerated brain maturation in adolescents, more so in females than males.",
			date: "2 weeks ago",
			image: "/featured-images/W4402349677.jpg",
			url: "/paper/oa/W4402349677",
		},
		{
			title:
				"Americans have more friends than previously thought, but long for deeper connections, new study reveals.",
			date: "2 months ago",
			image: "/featured-images/W4401124912.jpg",
			url: "/paper/oa/W4401124912",
		},
		{
			title:
				"People vastly underestimate carbon footprint inequality, undermining climate policy support and fairness perceptions across 4 diverse countries.",
			date: "6 months ago",
			image: "/featured-images/W4392663783.jpg",
			url: "/paper/oa/W4392663783",
		},
		{
			title:
				"Defibrillator pad placement boosts cardiac arrest survival by over 150%.",
			date: "20 days ago",
			image: "/featured-images/W4402356829.jpg",
			url: "/paper/oa/W4402356829",
		},
	];

	// Select a random item on the server.
	const randomIndex: number = Math.floor(Math.random() * items.length);
	// Assert that the random item is not undefined
	const randomItem = items[randomIndex];
	if (!randomItem) {
		throw new Error("Failed to fetch a random item");
	}
	return randomItem;
}

const RandomStaticItem = async () => {
	// Fetch the random item on the server
	const randomItem = await getRandomItem();

	return (
		<div className="bg-[#9CC4C7] hover:shadow rounded-2xl">
			<a href={randomItem.url}>
				<img
					src={randomItem.image}
					alt={randomItem.title}
					className="rounded-2xl p-2"
				/>
				<div className="p-3.5 h-full flex flex-col gap-2 justify-between">
					<div className="flex flex-col gap-3">
						<div>
							<div className="flex items-center justify-between gap-2 mb-1">
								<div className="flex items-center gap-2">
									<Star01 className="size-3.5" />
									<div className="text-2xs uppercase line-clamp-1">
										Featured paper
									</div>
								</div>
								<div className="flex items-center gap-2 ">
									<div className="uppercase text-2xs text-nowrap">
										{randomItem.date}
									</div>
								</div>
							</div>
							<p className="text-lg">{randomItem.title}</p>
						</div>
					</div>
				</div>
			</a>
		</div>
	);
};

export default RandomStaticItem;
