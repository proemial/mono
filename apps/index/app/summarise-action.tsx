"use server";
import { summarise } from "@/inngest/helpers/summarise";

export const summariseAction = async (title: string, abstract: string) => {
	"use server";
	return await summarise(title, abstract);
};
