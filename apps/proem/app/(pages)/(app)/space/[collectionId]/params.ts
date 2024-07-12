export type CollectionIdParams = {
	params: {
		collectionId: string;
	};
};

export type StreamDebugParams = {
	debug?: boolean;

	// Not supported since moving to spaces
	days?: string;
	weights?: string; // weights=c:0.5,t:1.1,k:0.9
	nocache?: boolean;
	user?: string;
};
