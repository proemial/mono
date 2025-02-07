export type SlackEntity = {
	createdAt: Date;
	type: "team" | "app";
	id: string;
	name: string;
	description?: string;
	metadata?: Partial<Record<EntityMetadataKeys, string>>;
};

type EntityMetadataKeys =
	| "accessToken"
	| "clientId"
	| "clientSecret"
	| "callback";
