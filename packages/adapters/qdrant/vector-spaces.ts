export type VectorSpace = {
	collection: VectorSpaceName;
	model: string;
	dimensions: number;
};

export type VectorSpaceName = "o3s1536beta" | "nomic768Alpha";

export const vectorSpaces: Array<VectorSpace> = [
	{
		collection: "nomic768Alpha",
		model: "nomic-embed-text-v1.5",
		dimensions: 1024,
	},
	{
		collection: "o3s1536beta",
		model: "text-embedding-3-small",
		dimensions: 1536,
	},
];

export const defaultVectorSpace = vectorSpaces.at(1) as VectorSpace;

export function vectorSpace(name: VectorSpaceName): VectorSpace {
	const space = vectorSpaces.find(
		(space) => space.collection === name,
	) as VectorSpace;
	if (!space) {
		throw new Error(`Vector space ${name} not found`);
	}

	return space;
}
