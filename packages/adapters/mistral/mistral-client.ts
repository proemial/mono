import { Mistral } from "@mistralai/mistralai";

const DEFAULT_MODEL_OCR = "mistral-ocr-latest";

type MistralClientOptions = {
	apiKey: string | undefined;
};

export class MistralClient {
	private client: Mistral;

	constructor(options: MistralClientOptions) {
		if (!options.apiKey) {
			throw new Error("Mistral API key is required");
		}
		this.client = new Mistral({
			apiKey: options.apiKey,
		});
	}

	public async parseWithOCR(file: File) {
		console.log(`Mistral OCR: Parsing file ${file.name}…`);
		const createdFile = await this.client.files.upload({
			file: {
				fileName: file.name,
				content: file,
			},
			// @ts-ignore: Mistral SDK is not updated, but API supports this
			purpose: "ocr",
		});
		const signedUrl = await this.client.files.getSignedUrl({
			fileId: createdFile.id,
		});
		const ocrResponse = await this.client.ocr.process({
			model: DEFAULT_MODEL_OCR,
			document: {
				type: "document_url",
				documentUrl: signedUrl.url,
				documentName: file.name,
			},
			// Images can be OCR'd like this:
			// document: {
			// 	type: "image_url",
			// 	imageUrl: { url: "data:image/png;base64,iVBORw0" },
			// },
			includeImageBase64: false,
		});
		// Delete file on remote host
		await this.client.files.delete({
			fileId: createdFile.id,
		});
		return ocrResponse;
	}
}
