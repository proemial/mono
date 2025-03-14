const welcomeChannelNudges = [
	[
		"Hello, #{channel} 👋 I’m thrilled to join this channel. 🎉\n\nCount on me to craft concise and insightful summaries of the links and documents you share. I’m also here to tackle any questions you throw my way with enthusiasm and expertise.\n\nDon’t hesitate to tag or DM me @proem—I’m eager to help! 🌟",
	],
];

const welcomeEphemeralNudges = [
	[
		"Proem Agent added to channel.",
		"",
		"To show other people what @proem can do, try to post a link: ",
		"{recent popular reddit/science article} [post] ",
		"(or maybe {recent article close to channel history} [post])",
		"",
		"...or ask @proem a question: ",
		"{@proem why do we sleep?} [ask] ",
		"{@proem what is open innovation?} [ask]",
	],
];

export const nudgeMessage = {
	welcomeToChannel: () => {
		return randomItem(welcomeChannelNudges);
	},
	welcomeToEphemeral: () => {
		return randomItem(welcomeEphemeralNudges);
	},
};

const randomItem = (array: string[][]) => {
	return array[Math.floor(Math.random() * array.length)] as string[];
};
