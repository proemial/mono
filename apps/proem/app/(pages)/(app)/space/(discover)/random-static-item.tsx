import FeaturedLink from "./featured-link";

interface Item {
	title: string;
	date: string;
	image: string;
	url: string;
}

export const staticItems: Item[] = [
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

async function getRandomItem(): Promise<Item> {
	const randomIndex: number = Math.floor(Math.random() * staticItems.length);
	const randomItem = staticItems[randomIndex];
	if (!randomItem) {
		throw new Error("Failed to fetch a random item");
	}
	return randomItem;
}

const RandomStaticItem = async () => {
	const randomItem = await getRandomItem();
	return <FeaturedLink item={randomItem} />;
};

export default RandomStaticItem;
