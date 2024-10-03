"use server";
import { summariseTitle } from "@/inngest/helpers/summarise";

export const summariseAction = async (title: string, abstract: string) => {
	"use server";
	return await summariseTitle(title, abstract);
};
