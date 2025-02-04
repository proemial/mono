import { Time } from "@proemial/utils/time";
import Mongo from "../mongodb-client";
import { SlackEntity } from "./entities.types";
import { Event } from "./events.types";
import { ScrapedUrl } from "./scraped.types";

const events = Mongo.db("slack").collection("events");
const entities = Mongo.db("slack").collection("entities");
const scraped = Mongo.db("slack").collection("scraped");

export const SlackDb = {
	events: {
		get: async (id: string) => {
			const begin = Time.now();

			try {
				return await events.findOne<Event>({
					"metadata.eventId": id,
				});
			} finally {
				Time.log(begin, `[mongodb][slack][events][get] ${id}`);
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

		insert: async (entity: SlackEntity) => {
			const begin = Time.now();

			try {
				return await entities.insertOne(entity);
			} finally {
				Time.log(begin, `[mongodb][slack][entities][insert] ${entity.id}`);
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
