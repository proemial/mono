import { Time } from "@proemial/utils/time";
import Mongo from "../mongodb-client";
import { Event, SlackEntity } from "./slack.types";

const events = Mongo.db("slack").collection("events");
const entities = Mongo.db("slack").collection("entities");

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
				return await entities.findOne<SlackEntity>({
					id,
				});
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
};
