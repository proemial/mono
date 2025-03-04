export namespace EnvVars {
	export const isInternalSlackApp = (appId: string | undefined) => {
		if (!appId) {
			return false;
		}
		const internalAppIds =
			process.env.INTERNAL_SLACK_APP_IDS?.split(",").filter(Boolean) ?? [];
		return internalAppIds.includes(appId);
	};
}
