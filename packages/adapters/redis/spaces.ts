import { Time } from "@proemial/utils/time";
import { UpStash } from "./upstash-client";
import { VectorSpaceName } from "../qdrant/vector-spaces";

export const RedisSpaces = {
	get: async (slugs: SpaceSlugs) => {
		const begin = Time.now();
		const identifier = `${slugs.owner}/${slugs.space}`;

		try {
			return (await UpStash.spaces().get(`${identifier}`)) as RedisSpace | null;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			Time.log(begin, `[redis][spaces][get] ${identifier}`);
		}
	},
};

export type RedisSpace = {
	metadata: SpaceMetadata;
	query: SpaceQuery;
	runtime: SpaceConfig;
	slugs: SpaceSlugs;
	vectors: SpaceVectors;
};

export type SpaceMetadata = {
	title: string;
	description: string;
	author?: {
		name: string;
		email: string;
	};
};

export type SpaceQuery = {
	like: string;
	unlike?: string;
	period: string;
};

export type SpaceConfig = {
	index: VectorSpaceName;
	quantization?: "binary" | undefined;
};

export type SpaceSlugs = {
	owner: string;
	space: string;
};

export type SpaceVectors = {
	like: number[];
	unlike?: number[];
};
