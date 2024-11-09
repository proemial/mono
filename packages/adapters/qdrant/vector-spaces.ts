export type VectorSpace = {
	collection: VectorSpaceName;
	model: string;
	dimensions: number;
};

export type VectorSpaceName = "o3s1536alpha" | "o3s1536beta";

export const vectorSpaces: Array<VectorSpace> = [
	{
		collection: "o3s1536alpha",
		model: "text-embedding-3-small",
		dimensions: 1536,
	},
	{
		collection: "o3s1536beta",
		model: "text-embedding-3-small",
		dimensions: 1536,
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
