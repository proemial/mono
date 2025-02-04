export type SlackEntity = {
	createdAt: Date;
	type: "team" | "app";
	id: string; // incoming_webhook.channel_id || team.id
	name: string; // incoming_webhook.channel || team.name
	metadata?: Partial<Record<EntityMetadataKeys, string>>;
	// url?: string; // incoming_webhook.url
	// accessToken?: string; // access_token
};

type EntityMetadataKeys =
	| "accessToken"
	| "clientId"
	| "clientSecret"
	| "callback";
