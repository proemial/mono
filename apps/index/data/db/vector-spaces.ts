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
	"0.5k": {
		collection: "o3s512alpha",
		model: "text-embedding-3-small",
		dimensions: 512,
	},
};
