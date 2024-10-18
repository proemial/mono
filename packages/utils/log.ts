const debug = process.env.NODE_ENV === "development";

export const Log = {
	debug: (message: string) => {
		if (debug) {
			console.log(message);
		}
	},
	info: (message: string) => {
		console.log(message);
	},
	error: (message: string) => {
		console.error(message);
	},
};
