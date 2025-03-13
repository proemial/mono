import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import Link from "next/link";

export const maxDuration = 300;

type Props = {
	params: { appId: string; teamId: string };
};

type Channel = {
	id: string;
	name: string;
	topic: { value: string };
	purpose: { value: string };
	is_member: boolean;
};

export default async function SlackChannelsPage({ params }: Props) {
	const { teamId } = params;
	const app = await SlackDb.installs.get(teamId, "A08AD1FSPHV");
	if (!app) {
		return <div>Installation not found</div>;
	}

	const result = await fetch(
		"https://slack.com/api/conversations.list?limit=200",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${app.metadata.accessToken}`,
			},
		},
	);
	const json = await result.json();

	const channels = json.channels
		.filter(
			(channel: { is_archived: boolean; is_member: boolean }) =>
				!channel.is_archived && channel.is_member,
		)
		.sort((a: { is_member: boolean }) => {
			return a.is_member ? -1 : 1;
		})
		.map((channel: Channel) => ({
			id: channel.id,
			name: channel.name,
			topic: channel.topic.value,
			purpose: channel.purpose.value,
			is_member: channel.is_member,
		}));

	return (
		<div className="p-4">
			<div className="text-xl mb-4">
				<span className="font-bold italic">{app.team.name}</span> has added{" "}
				<span className="font-bold italic">@proem</span> to the following
				channels:
			</div>

			<div className="ml-4 space-y-1">
				{channels.map((channel: Channel) => (
					<div key={channel.id}>
						<Link
							className="text-blue-500 hover:underline"
							href={`/api/helpers/${teamId}/channel/${channel.id}`}
						>
							{channel.name}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
