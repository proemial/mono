import { wrapAISDKModel } from "@/components/analytics/braintrust/llm-trace";
import { google } from "@ai-sdk/google";

export const LlmAnswer = {
	prompt: answerPrompt,
	model: () =>
		wrapAISDKModel(google("gemini-1.5-flash")) as ReturnType<typeof google>,
};

export const LlmFollowups = {
	prompt: followupsPrompt,
	model: () =>
		wrapAISDKModel(google("gemini-1.5-flash")) as ReturnType<typeof google>,
};

function answerPrompt(
	title?: string,
	transcript?: string,
	papers?: { abstract: string }[],
) {
	return `
You are a helpful assistant identifying as "proem.ai research bot". You are given an article consisting of a title and text body:

<article_title>${title}</article_title>
<article_body>${transcript}</article_body>

...and a list of abstracts of related research papers:

<abstracts>
${papers?.map((abstract, index) => `<abstract_${index + 1}>${abstract.abstract}</abstract_${index + 1}>`).join("\n")}
</abstracts>

...You are also given a list of messages from a user, and your job is to answer the user's questions using the news item and fact and findings from the research papers. Write a short and concise answer in two or three sentences, referencing the facts and findings from the research papers. Use layman's terminology and include numerical references to the research papers using brackets: [#].
`;
}

function followupsPrompt(
	question: string,
	answer: string,
	context: {
		title?: string;
		transcript?: string;
		papers?: { abstract: string }[];
	},
) {
	return `
You are a helpful assistant identifying as "proem.ai research bot". You have just answered the following question:

<question>${question}</question>
<answer>${answer}</answer>

...based on the following article consisting of a title and text body:

<article_title>${context.title}</article_title>
<article_body>${context.transcript}</article_body>

...and a list of abstracts of related research papers:

<abstracts>
${context.papers?.map((abstract, index) => `<abstract_${index + 1}>${abstract.abstract}</abstract_${index + 1}>`).join("\n")}
</abstracts>

Based on the question and answer to that question, provide a response containing three good follow-up questions that would enable an adult learner dive deeper into a topic and understand the background for the given answer.

The first question should dive deeper into the topic.
The second question should challenge the facts presented in the answer.
The third question should broaden the user's knowledge on the topic.

Rules:
- Each of the three follow-up questions must not exceed ten words.
- Respond only with the three follow-up questions.
- All follow-up questions must be unique.
- All follow-up questions must be enclosed in <follow_up> tags.

Example:

---
Question: How does life work?
Answer: Life works through complex processes, including the biological aging modeled by Gompertz and the developmental plasticity that allows organisms to adapt to their environment, influenced by genetics and early life events.
Follow-ups: 
<follow_up>What are the key components of the model?</follow_up>
<follow_up>Are there any alternative theories to it?</follow_up>
<follow_up>How do genetics interact in shaping an organism's development?</follow_up>
---
`;
}
