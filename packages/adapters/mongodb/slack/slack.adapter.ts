import { Time } from "@proemial/utils/time";
import Mongo from "../mongodb-client";
import { SlackApp, SlackAppInstall, SlackEntity } from "./entities.types";
import { Event, SlackEventCallback } from "./events.types";
import { ScrapedUrl } from "./scraped.types";
import { SlackV2Event, SlackV2EventFromDb } from "./v2.models";

const events = Mongo.db("slack").collection("events");
const v2Events = Mongo.db("slack").collection("v2events");
const entities = Mongo.db("slack").collection("entities");
const scraped = Mongo.db("slack").collection("scraped");

export const SlackDb = {
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
