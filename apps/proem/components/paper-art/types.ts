export type ModelId =
	| "amazon.titan-image-generator-v1"
	| "stability.stable-diffusion-xl-v1";

export type TitanImageGeneratorG1Params = {
	textToImageParams: {
		text: string;
		negativeText?: string;
	};
	taskType: "TEXT_IMAGE";
	imageGenerationConfig: {
		quality: "standard";
		numberOfImages?: number;
		cfgScale?: number;
		width?: number;
		height?: number;
		seed?: number;
	};
};

export type StableDiffusionXLParams = {
	// E.g. Add a negative prompt by adding a second text prompt with a negative weight
	text_prompts: Array<{
		text: string;
		weight?: number;
	}>;
	cfg_scale: 7;
	clip_guidance_preset?:
		| "FAST_BLUE"
		| "FAST_GREEN"
		| "NONE"
		| "SIMPLE"
		| "SLOW"
		| "SLOWER"
		| "SLOWEST";
	height?: number;
	width?: number;
	sampler?:
		| "DDIM"
		| "DDPM"
		| "K_DPMPP_2M"
		| "K_DPMPP_2S_ANCESTRAL"
		| "K_DPM_2"
		| "K_DPM_2_ANCESTRAL"
		| "K_EULER"
		| "K_EULER_ANCESTRAL"
		| "K_HEUN"
		| "K_LMS";
	samples?: number;
	seed?: number;
	steps?: number;
	style_preset?:
		| "3d-model"
		| "analog-film"
		| "anime"
		| "cinematic"
		| "comic-book"
		| "digital-art"
		| "enhance"
		| "fantasy-art"
		| "isometric"
		| "line-art"
		| "low-poly"
		| "modeling-compound"
		| "neon-punk"
		| "origami"
		| "photographic"
		| "pixel-art"
		| "tile-texture";
};
