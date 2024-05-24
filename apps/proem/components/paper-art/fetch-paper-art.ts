"use server";

import {
	BedrockRuntimeClient,
	InvokeModelCommand,
	InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";
import { neonDb } from "@proemial/data";
import { papers } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import {
	ModelId,
	StableDiffusionXLParams,
	TitanImageGeneratorG1Params,
} from "./types";

const bedrockClient = new BedrockRuntimeClient({
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});

export const fetchPaperArt = async (
	paperId: string,
	generateOptions?: {
		paperTitle: string;
	},
) => {
	// TODO: Auth and rate limiting
	const existingPaper = await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
	});
	if (existingPaper?.paperArt) {
		return existingPaper.paperArt;
	}
	if (!generateOptions) {
		return undefined;
	}
	const paperArt = await generateImage({
		modelId: "stability.stable-diffusion-xl-v1",
		prompt: `Generate a single image based on the following headline. Use at least three colors. Headline: ${generateOptions.paperTitle}`,
		negativePrompt: "letters, numbers, symbols, multiple images",
	});
	await neonDb
		.insert(papers)
		.values({
			id: paperId,
			paperArt,
		})
		.onConflictDoUpdate({
			target: papers.id,
			set: {
				paperArt,
			},
		});
	return paperArt;
};

/**
 * Generate an image from a given prompt using an image generation model on
 * Bedrock. The image is returned as a base64-encoded string usable as "src" in
 * a next/image component.
 */
const generateImage = async (params: {
	modelId: ModelId;
	prompt: string;
	negativePrompt?: string;
}) => {
	const { modelId, prompt, negativePrompt } = params;
	const modelCommand = new InvokeModelCommand({
		contentType: "application/json",
		accept: "application/json",
		...getModelCommand(modelId, prompt, negativePrompt),
	});
	console.log("Generating image with prompt:", prompt);
	const start = performance.now();
	const response = await bedrockClient.send(modelCommand);
	const parsedImage = parseImageReponse(modelId, response);
	const finish = performance.now();
	console.log(`Image generation time: ${Math.floor(finish - start)} ms`);
	return `data:image/png;base64,${parsedImage}`;
};

const getModelCommand = (
	modelId: ModelId,
	prompt: string,
	negativePrompt?: string,
) => {
	switch (modelId) {
		case "amazon.titan-image-generator-v1":
			// Source: https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-titan-image.html
			return {
				modelId: "amazon.titan-image-generator-v1",
				body: JSON.stringify({
					textToImageParams: {
						text: cutIfExceeds(prompt, 512),
						negativeText: negativePrompt && cutIfExceeds(negativePrompt, 512),
					},
					taskType: "TEXT_IMAGE",
					imageGenerationConfig: {
						numberOfImages: 1,
						height: 320,
						width: 704,
						quality: "standard",
						cfgScale: 8,
						seed: 0,
					},
				} satisfies TitanImageGeneratorG1Params),
			};
		case "stability.stable-diffusion-xl-v1":
			// Source: https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-diffusion-1-0-text-image.html
			return {
				modelId: "stability.stable-diffusion-xl-v1",
				body: JSON.stringify({
					text_prompts: [
						{
							text: cutIfExceeds(prompt, 2000),
							weight: 1,
						},
						...(negativePrompt
							? [{ text: cutIfExceeds(negativePrompt, 2000), weight: -1 }]
							: []),
					],
					cfg_scale: 7,
					clip_guidance_preset: undefined,
					height: 640,
					width: 1536,
					sampler: undefined,
					samples: 1,
					seed: 0,
					steps: 10,
					style_preset: undefined,
				} satisfies StableDiffusionXLParams),
			};
		default:
			throw new Error(`Model ${modelId} is not supported`);
	}
};

const parseImageReponse = (
	modelId: ModelId,
	response: InvokeModelCommandOutput,
) => {
	const blobAdapter = response.body;
	const textDecoder = new TextDecoder("utf-8");
	const jsonString = textDecoder.decode(blobAdapter.buffer);
	switch (modelId) {
		case "amazon.titan-image-generator-v1": {
			const parsedData = JSON.parse(jsonString) as { images: string[] };
			if (!parsedData.images[0]) {
				throw new Error(
					"Expected an image from Bedrock, but no images were generated.",
				);
			}
			return parsedData.images[0];
		}
		case "stability.stable-diffusion-xl-v1": {
			const parsedData = JSON.parse(jsonString) as {
				artifacts: Array<{
					seed: number;
					base64: string;
					finishReason: string;
				}>;
			};
			if (!parsedData.artifacts[0]) {
				throw new Error(
					"Expected an image from Bedrock, but no images were generated.",
				);
			}
			return parsedData.artifacts[0].base64;
		}
		default:
			throw new Error(`Model ${modelId} is not supported`);
	}
};

const cutIfExceeds = (text: string, maxLength: number) =>
	text.length > maxLength ? text.slice(0, maxLength) : text;
