export function parseMessageSource(payload: Record<string, any>) {
	const teamId =
		payload.team_id ??
		payload.team?.id ??
		payload.event.team ??
		payload.message?.team;
	const channelId =
		payload.event?.channel ??
		payload.channel?.id ??
		payload.event?.assistant_thread?.context?.channel_id;

	return {
		teamId,
		channelId,
	};
}
