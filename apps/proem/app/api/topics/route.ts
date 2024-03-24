import { openAIApiKey, openaiOrganizations } from "@/app/prompts/openai-keys";
import OpenAI from "openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import * as hub from "langchain/hub";

// const model = "gpt-3.5-turbo-instruct";

export async function GET() {
	const openai = new OpenAI({
		apiKey: openAIApiKey,
		organization: openaiOrganizations.ask,
	});

	const prompt = await hub.pull("proemial/oa-topic-shortener:b6dd6076");
	// console.log("prompt", prompt);

	// create a model to use it with
	const model = new ChatOpenAI(openai);
	console.log("model", model);

	// use it in a runnable
	const runnable = prompt.pipe(model);
	const result = await runnable.invoke({
		topics: `
Clustered Regularly Interspaced Short Palindromic Repeats and CRISPR-associated proteins
Comprehensive Integration of Single-Cell Transcriptomic Data
Cyclotide Bioengineering and Protein Anchoring Mechanisms
Diversity and Function of Gut Microbiome
Diversity and Systematics of Yeasts
DNA Barcoding for Food Authentication and Fraud Detection
DNA Nanotechnology and Bioanalytical Applications
  `,
	});

	return Response.json({
		string: result.content,
		array: (result.content as string).split("\n"),
	});
}
