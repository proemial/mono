import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

export default async function ocrParseFile(fileBlob: File) {
	const uploaded_pdf = await client.files.upload({
		file: fileBlob,
	});
	const signed_url = await client.files.getSignedUrl({
		fileId: uploaded_pdf.id,
	});

	const ocrResponse = await client.ocr.process({
		model: "Focus",
		document: {
			documentUrl: signed_url.url,
		},
	});

	return ocrResponse;
}
