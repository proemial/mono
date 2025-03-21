import { Time } from "@proemial/utils/time";
import Mongo from "../mongodb-client";
import { SlackApp, SlackAppInstall, SlackEntity } from "./entities.types";
import { Event, SlackEventCallback } from "./events.types";
import { ScrapedUrl } from "./scraped.types";
import { EventLogItem, EventMetric } from "./v2.models";
import { PushOperator, Document } from "mongodb";
import { SlackEventMetadata } from "../../slack/models/metadata-models";

const oauthEvents = Mongo.db("slack").collection("events");
const entities = Mongo.db("slack").collection("entities");
const scraped = Mongo.db("slack").collection("scraped");
const metrics = Mongo.db("slack").collection("event-metrics");
const eventLog = Mongo.db("slack").collection("event-log");

const activityLog = Mongo.db("slack").collection("activity-log");

export const SlackDb = {
	activityLog: {
		upsert: async (metadata: SlackEventMetadata) => {
			const begin = Time.now();

			try {
				if (
					!metadata.user ||
					["suggestions", "welcome"].includes(metadata.target)
				) {
					// Do not log bot activity
					return;
				}

				return await activityLog.updateOne(
					{
						appId: metadata.appId,
						teamId: metadata.teamId,
						channelId: metadata.channelId,
						userId: metadata.user,
						target: metadata.target,
					},
					{
						$setOnInsert: {
							createdAt: new Date(),
						},
						$set: {
							updatedAt: new Date(),
							latestAt: {
								ts: metadata.ts,
								threadTs: metadata.threadTs,
							},
						},
					},
					{ upsert: true },
				);
			} finally {
				Time.log(begin, "[db][activityLog][upsert]");
			}
		},
	},

	metrics: {
		insert: async (metric: EventMetric) => {
			const begin = Time.now();

			try {
				return await metrics.insertOne(metric);
			} finally {
				Time.log(begin, "[db][metrics][insert]");
			}
		},
	},

	eventLog: {
		upsert: async (event: EventLogItem) => {
			const begin = Time.now();

			try {
				if (!event.metadata.context?.ts || !event.metadata.context?.channelId) {
					throw new Error("ts and channelId are required");
				}

				const { requests, ...rest } = event;

				return await eventLog.updateOne(
					{
						"metadata.appId": event.metadata.appId,
						"metadata.teamId": event.metadata.teamId,
						"metadata.context.ts": event.metadata.context?.ts,
						"metadata.context.channelId": event.metadata.context?.channelId,
					},
					{
						$set: {
							...rest,
						},
						...(requests?.length && {
							$push: {
								requests: {
									createdAt: new Date(),
									...requests.at(-1),
								},
							} as PushOperator<Document>["requests"],
						}),
					},
					{ upsert: true },
				);
			} finally {
				Time.log(
					begin,
					`[db][eventLog][upsert] ${event.requests.at(-1)?.type}`,
				);
			}
		},

		getUserMessage: async (metadata: SlackEventMetadata) => {
			const begin = Time.now();

			try {
				const filter = {
					"metadata.appId": metadata.appId,
					"metadata.teamId": metadata.teamId,
					"metadata.context.channelId": metadata.channelId,
					"metadata.context.ts": metadata.ts,
				};
				const event = await eventLog.findOne<EventLogItem>(filter);

				return (
					event?.requests as {
						type: string;
						input: { payload: SlackEventCallback };
					}[]
				).find((r) => r.type !== "ignored" && r.input.payload.event?.text)
					?.input.payload.event;
			} finally {
				Time.log(begin, "[db][eventLog][getUserMessage]");
			}
		},

		get: async (metadata: Omit<SlackEventMetadata, "target">) => {
			const begin = Time.now();

			try {
				const filter = {
					"metadata.appId": metadata.appId,
					"metadata.teamId": metadata.teamId,
					"metadata.context.channelId": metadata.channelId,
					"metadata.context.ts": metadata.ts,
				};

				return await eventLog.findOne<EventLogItem>(filter);
			} finally {
				Time.log(begin, "[db][eventLog][get]");
			}
		},
	},

	oauth: {
		insert: async (event: Event) => {
			const begin = Time.now();

			try {
				return await oauthEvents.insertOne(event);
			} finally {
				Time.log(begin, `[db][oauth][insert] ${event.metadata.eventId}`);
			}
		},
	},

	apps: {
		get: async (id: string) => {
			const begin = Time.now();

			try {
				return await entities.findOne<SlackApp>({
					id,
				});
			} finally {
				Time.log(begin, `[db][apps][get] ${id}`);
			}
		},
	},

	installs: {
		get: async (teamId: string, appId: string, userId?: string) => {
			const begin = Time.now();

			try {
				if (userId) {
					return await entities.findOne<SlackAppInstall>({
						"team.id": teamId,
						"app.id": appId,
						"user.id": userId,
					});
				}
				return await entities.findOne<SlackAppInstall>({
					"team.id": teamId,
					"app.id": appId,
					"user.id": { $exists: false },
				});
			} finally {
				Time.log(begin, `[db][installs][get] ${teamId} ${appId} ${userId}`);
			}
		},

		getTokensForUserAndTeam: async (
			teamId: string,
			appId: string,
			userId: string,
		) => {
			const begin = Time.now();

			try {
				const result = entities.find<SlackAppInstall>({
					"app.id": appId,
					"team.id": teamId,
					$or: [{ "user.id": userId }, { "user.id": { $exists: false } }],
				});

				const installs = await result.toArray();

				return {
					userToken: installs.find((i) => i.user)?.metadata.accessToken,
					teamToken: installs.find((i) => !i.user)?.metadata.accessToken,
				};
			} finally {
				Time.log(begin, `[db][installs][get] ${teamId} ${appId} ${userId}`);
			}
		},

		upsert: async (entity: SlackAppInstall) => {
			const begin = Time.now();

			try {
				if (entity.user) {
					return await entities.updateOne(
						{
							"team.id": entity.team.id,
							"app.id": entity.app.id,
							"user.id": entity.user.id,
						},
						{ $set: entity },
						{ upsert: true },
					);
				}
				return await entities.updateOne(
					{ "team.id": entity.team.id, "app.id": entity.app.id },
					{ $set: entity },
					{ upsert: true },
				);
			} finally {
				Time.log(
					begin,
					`[db][installs][upsert] ${entity.team.id} ${entity.app.id} ${entity.user?.id}`,
				);
			}
		},

		delete: async (appId: string, teamId: string) => {
			const begin = Time.now();

			try {
				return await entities.deleteMany({
					"app.id": appId,
					"team.id": teamId,
				});
			} finally {
				Time.log(begin, `[db][installs][delete] ${appId} ${teamId}`);
			}
		},
	},

	// @deprecated
	entities: {
		get: async (id: string) => {
			const begin = Time.now();

			try {
				return await entities.findOne<SlackEntity>(
					{
						id,
					},
					{ sort: { _id: -1 } },
				);
			} finally {
				Time.log(begin, `[db][entities][get] ${id}`);
			}
		},

		upsert: async (entity: SlackEntity) => {
			const begin = Time.now();

			try {
				return await entities.updateOne(
					{ id: entity.id },
					{ $set: entity },
					{ upsert: true },
				);
			} finally {
				Time.log(begin, `[db][entities][upsert] ${entity.id}`);
			}
		},
	},

	scraped: {
		get: async (url: string) => {
			const begin = Time.now();

			try {
				return await scraped.findOne<ScrapedUrl>({
					url,
				});
			} finally {
				Time.log(begin, `[db][scraped][get] ${url}`);
			}
		},

		upsert: async (entity: ScrapedUrl) => {
			const begin = Time.now();

			try {
				return await scraped.updateOne(
					{ url: entity.url },
					{
						$set: {
							...entity,
						},
					},
					{ upsert: true },
				);
			} finally {
				Time.log(begin, `[db][scraped][upsert] ${entity.url}`);
			}
		},
	},
};
