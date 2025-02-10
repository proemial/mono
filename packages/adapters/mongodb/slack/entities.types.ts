// @deprecated
export type SlackEntity = {
	createdAt: Date;
	type: "team" | "app";
	id: string;
	name: string;
	description?: string;
	metadata?: Partial<Record<EntityMetadataKeys, string>>;
};

// @deprecated
type EntityMetadataKeys =
	| "accessToken"
	| "clientId"
	| "clientSecret"
	| "callback";

export type SlackAppInstall = {
	createdAt: Date;
	type: "install";
	team: {
		id: string;
		name?: string;
	};
	app: {
		id: string;
		name?: string;
	};
	metadata: {
		accessToken: string;
	};
};

export type SlackApp = {
	createdAt: Date;
	type: "app";
	id: string;
	name: string;
	metadata: {
		clientId: string;
		clientSecret: string;
		callback: string;
	};
};
