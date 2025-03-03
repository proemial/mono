export namespace EnvVars {
	export const isInternalSlackTeam = (teamId: string | undefined) => {
		if (!teamId) {
			return false;
		}
		const internalTeamIds =
			process.env.INTERNAL_SLACK_TEAM_IDS?.split(",").filter(Boolean) ?? [];
		return internalTeamIds.includes(teamId);
	};
}
