import { Log } from "./log";

export const Time = {
	now: () => new Date().getTime(),
	elapsed: (begin: number) => Time.now() - begin,
	log: (begin: number, message: string) => {
		Log.info(`[${Time.elapsed(begin)}] ${message}`);
	},
	debug: (begin: number, message: string) => {
		Log.debug(`[${Time.elapsed(begin)}] ${message}`);
	},
};
