export type VectorSpace = {
	collection: string;
	model: string;
	dimensions: number;
};
export type VectorSpaceId = "nomic768Alpha" | "o3s1536beta";
export const vectorSpaces: Record<VectorSpaceId, VectorSpace> = {
	nomic768Alpha: {
		collection: "nomic768Alpha",
		model: "nomic-embed-text-v1.5",
		dimensions: 1024,
	},
	o3s1536beta: {
		collection: "o3s1536beta",
		model: "text-embedding-3-small",
		dimensions: 1536,
	},
};

export const defaultVectorSpaceName: VectorSpaceId = "o3s1536beta";
export const defaultVectorSpace = vectorSpaces[defaultVectorSpaceName];
