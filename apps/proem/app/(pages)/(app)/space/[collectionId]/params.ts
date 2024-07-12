export type CollectionIdParams = {
	params: {
		collectionId: string;
	};
};

export type StreamDebugParams = {
	topic?: string;
	days?: string;
	debug?: boolean;
	weights?: string; // weights=c:0.5,t:1.1,k:0.9
	nocache?: boolean;
	user?: string;
};
