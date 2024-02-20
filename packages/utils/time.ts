export const Time = {
	now: () => new Date().getTime(),
	elapsed: (begin: number) => Time.now() - begin,
	log: (begin: number, message: string) => {
		console.log(`[${Time.elapsed(begin)}] ${message}`);
	},
};
