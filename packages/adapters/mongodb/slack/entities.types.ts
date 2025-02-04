export type SlackEntity = {
	createdAt: Date;
	type: "channel" | "team" | "app";
	id: string; // incoming_webhook.channel_id || team.id
	name: string; // incoming_webhook.channel || team.name
	metadata?: Partial<Record<EntityMetadataKeys, string>>;
	// url?: string; // incoming_webhook.url
	// accessToken?: string; // access_token
};

type EntityMetadataKeys =
	| "url"
	| "accessToken"
	| "clientId"
	| "clientSecret"
	| "configurationUrl"
	| "callback";
