export type VectorSpace = {
	collection: string;
	model: string;
	dimensions: number;
};
export const vectorSpaces: Record<string, VectorSpace> = {
	"1.5k": {
		collection: "o3s1536alpha",
		model: "text-embedding-3-small",
		dimensions: 1536,
	},
	o3s1536beta: {
		collection: "o3s1536beta",
		model: "text-embedding-3-small",
		dimensions: 1536,
	},
};

export const defaultVectorSpaceName = "o3s1536beta";
export const defaultVectorSpace = vectorSpaces[
	defaultVectorSpaceName
] as VectorSpace;
