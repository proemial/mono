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
};

export const defaultVectorSpaceName = "1.5k";
export const defaultVectorSpace = vectorSpaces[
	defaultVectorSpaceName
] as VectorSpace;
