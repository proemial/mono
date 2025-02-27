import { Time } from "@proemial/utils/time";
import Mongo from "../mongodb-client";
import { SlackApp, SlackAppInstall, SlackEntity } from "./entities.types";
import { Event, SlackEventCallback } from "./events.types";
import { ScrapedUrl } from "./scraped.types";
import {
	EventLogItem,
	EventMetric,
	SlackV2Event,
	SlackV2EventFromDb,
} from "./v2.models";
import { PushOperator, Document } from "mongodb";
import { SlackEventMetadata } from "../../slack/models/metadata-models";

const events = Mongo.db("slack").collection("events");
const v2Events = Mongo.db("slack").collection("v2events");
const entities = Mongo.db("slack").collection("entities");
const scraped = Mongo.db("slack").collection("scraped");
const metrics = Mongo.db("slack").collection("event-metrics");
const eventLog = Mongo.db("slack").collection("event-log");

export const SlackDb = {
	metrics: {
		insert: async (metric: EventMetric) => {
			const begin = Time.now();

			try {
				return await metrics.insertOne(metric);
			} finally {
				Time.log(begin, "[mongodb][slack][metrics][insert]");
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
					`[mongodb][slack][eventLog][upsert] ${event.requests.at(-1)?.type}`,
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
				console.log("USR MESSAGE", filter, event);

				return (
					event?.requests as {
						type: string;
						input: { payload: SlackEventCallback };
					}[]
				).find((r) => r.type !== "ignored" && r.input.payload.event.text)?.input
					.payload.event;
			} finally {
				Time.log(begin, "[mongodb][slack][eventLog][getUserMessage]");
			}
		},

		getRequests: async (metadata: SlackEventMetadata) => {
			const begin = Time.now();

			try {
				const filter = {
					"metadata.appId": metadata.appId,
					"metadata.teamId": metadata.teamId,
					"metadata.context.channelId": metadata.channelId,
					"metadata.context.ts": metadata.ts,
				};

				const event = await eventLog.findOne<EventLogItem>(filter);
				const requests =
					event?.requests.filter((r) => r.type !== "ignored") ?? [];

				return {
					metadata: event?.metadata,
					requests,
				};
			} finally {
				Time.log(begin, "[mongodb][slack][eventLog][getRequests]");
			}
		},
	},

	events: {
		get: async (id: string, type?: string) => {
			const begin = Time.now();

			try {
				return await events.findOne<Event>({
					"metadata.eventId": id,
					...(type ? { type: type } : {}),
				});
			} finally {
				Time.log(begin, `[mongodb][slack][events][get] ${id} ${type}`);
			}
		},

		getAssistantThread: async (channelId: string) => {
			const begin = Time.now();

			try {
				const event = (await events.findOne<Event>(
					{
						"payload.event.type": "assistant_thread_started",
						"payload.event.assistant_thread.channel_id": channelId,
					},
					{
						sort: { createdAt: -1 },
						projection: { "payload.event.assistant_thread": 1 },
					},
				)) as unknown as { payload: SlackEventCallback };
				return event?.payload.event.assistant_thread;
			} finally {
				Time.log(
					begin,
					`[mongodb][slack][events][getAssistantThread] ${channelId}`,
				);
			}
		},

		insert: async (event: Event) => {
			const begin = Time.now();

			try {
				return await events.insertOne(event);
			} finally {
				Time.log(
					begin,
					`[mongodb][slack][events][insert] ${event.metadata.eventId}`,
				);
			}
		},
	},

	v2Events: {
		insert: async (event: SlackV2Event) => {
			const begin = Time.now();

			try {
				return await v2Events.insertOne({
					...event,
					createdAt: new Date(),
				});
			} finally {
				Time.log(begin, `[mongodb][slack][v2events][insert] ${event.eventId}`);
			}
		},

		list: async (eventId?: string) => {
			const begin = Time.now();

			try {
				return await v2Events
					.find<SlackV2EventFromDb>({
						eventId: eventId,
					})
					.toArray();
			} finally {
				Time.log(begin, `[mongodb][slack][v2events][list] ${eventId}`);
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
				Time.log(begin, `[mongodb][slack][apps][get] ${id}`);
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
				Time.log(
					begin,
					`[mongodb][slack][installs][get] ${teamId} ${appId} ${userId}`,
				);
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
				Time.log(
					begin,
					`[mongodb][slack][installs][get] ${teamId} ${appId} ${userId}`,
				);
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
					`[mongodb][slack][installs][upsert] ${entity.team.id} ${entity.app.id} ${entity.user?.id}`,
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
				Time.log(
					begin,
					`[mongodb][slack][installs][delete] ${appId} ${teamId}`,
				);
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
				Time.log(begin, `[mongodb][slack][entities][get] ${id}`);
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
				Time.log(begin, `[mongodb][slack][entities][upsert] ${entity.id}`);
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
				Time.log(begin, `[mongodb][slack][scraped][get] ${url}`);
			}
		},

		upsert: async (entity: ScrapedUrl) => {
			const begin = Time.now();

			try {
				return await scraped.updateOne(
					{ url: entity.url },
					{ $set: entity },
					{ upsert: true },
				);
			} finally {
				Time.log(begin, `[mongodb][slack][scraped][upsert] ${entity.url}`);
			}
		},
	},
};
