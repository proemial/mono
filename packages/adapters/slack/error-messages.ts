const fileSizeErrors = [
	"🚀 File's too chunky! We tap out at 5MB. Mind trimming it down a bit?",
	"Whoa there, big file energy! ({size}MB) is over our 5MB limit. Let's slim it down.",
	"This file's ambition exceeds our 5MB runway. Ship something smaller?",
];

const fileTypeErrors = [
	"That file type's giving us the cold shoulder. Try one we actually support?",
	"🤨 A {mimeType}? Hell no. That's not on our supported formats list. Try again?",
	"This file type and our system are having a communication breakdown. Got something more compatible?",
];

const scrapeErrors = [
	"Uh-oh, our scraper just face-planted. The devs are already caffeinating to fix it! 🛠️",
	"Well, that wasn't in the script. We're debugging this mess now! 🔍",
	"Yikes! Something broke on our end (shivers). We're on it though! 😬",
];

const missingMimiTypeErrors = [
	"This file's having an identity crisis. Can you check the format and try again?",
	"🤔 File type? Unknown. We need that metadata to do our thing here.",
	"This file is more mysterious than season finale cliffhangers. Mind reuploading with a clear format?",
];

const emptyErrors = [
	"We searched high and low, but came back empty-handed. Different link maybe?",
	"🤷 Went looking for content and found... absolutely nothing. Ship fast, not empty!",
	"This page is either empty or playing an excellent game of hide and seek. Got something with actual content?",
];

export const errorMessage = {
	unsupportedFile: (mimeType: string) => {
		return randomItem(fileTypeErrors).replace("{mimeType}", mimeType);
	},
	fileTooLarge: (size: number) => {
		return randomItem(fileSizeErrors).replace("{size}", size.toString());
	},
	scrapeError: () => randomItem(scrapeErrors),
	missingFileMimetype: () => randomItem(missingMimiTypeErrors),
	scrapeEmpty: () => randomItem(emptyErrors),
};

const randomItem = (array: string[]) => {
	return array[Math.floor(Math.random() * array.length)] as string;
};
