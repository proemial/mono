export type VectorSpace = {
	collection: VectorSpaceName;
	model: string;
	dimensions: number;
};

export type VectorSpaceName = "o3s1536alpha" | "mist1024alpha";

export const vectorSpaces: Array<VectorSpace> = [
	{
		collection: "o3s1536alpha",
		model: "text-embedding-3-small",
		dimensions: 1536,
	},
	{
		collection: "mist1024alpha",
		model: "mistral-embed",
		dimensions: 1024,
	},
];

export const defaultVectorSpace = vectorSpaces.at(0) as VectorSpace;

export function vectorSpace(name: VectorSpaceName): VectorSpace {
	const space = vectorSpaces.find(
		(space) => space.collection === name,
	) as VectorSpace;
	if (!space) {
		throw new Error(`Vector space ${name} not found`);
	}

	return space;
}
