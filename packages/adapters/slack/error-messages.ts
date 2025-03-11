const fileSizeErrors = [
	"🚀 Whoa, that's a big file! We can only handle up to 5MB. Mind trimming it down?",
	"Oof, that file is chonky ({size}MB)! Try something 5MB or less.",
	"That file is a little too ambitious—max size is 5MB.",
];

const fileTypeErrors = [
	"Hmm… we weren’t expecting that file type. Maybe try a different format?",
	"🤨 A {mimeType}? That’s not on our guest list. Try a supported file type!",
	"Not sure what to do with that file type. Maybe a different one?",
];

const scrapeErrors = [
	"Uh-oh, something went sideways. The devs are on it! 🛠️",
	"Well, that wasn’t supposed to happen. We’ll take a look! 🔍",
	"Yikes! That’s on us. Our team has been notified. 😬",
];

const missingMimiTypeErrors = [
	"We couldn’t figure out what kind of file that is. Can you check and try again?",
	"🤔 Something’s missing! We need a file type to process this.",
	"This file is a mystery… and not the fun kind. Can you reupload?",
];

const emptyErrors = [
	"We looked, but there was nothing there! Maybe try a different link?",
	"🤷 Not sure what happened, but we didn’t find any content.",
	"The page seems empty… or maybe it’s hiding from us?",
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
