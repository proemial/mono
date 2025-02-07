import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { uuid } from "@proemial/utils/uid";
import { isNakedLink, isNakedMention } from "../../utils/routing";
import { getChannelInfo } from "@proemial/adapters/slack/slack";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();

	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded);

	console.log(
		"[/slack/events/inbound]",
		payload.api_app_id,
		payload.event_id,
		payload.type,
		payload.event?.type,
		payload.event?.subtype,
		payload.event?.bot_profile?.name,
	);

	// Handle Slack verification requests
	if (payload.type === "url_verification") {
		return NextResponse.json({ challenge: payload.challenge });
	}
	if (payload.type === "ssl_check") {
		return NextResponse.json({ status: "ok" });
	}

	const teamId =
		payload.event.team ??
		payload.team_id ??
		payload.team?.id ??
		payload.message?.team;
	const channelId =
		payload.event?.channel ??
		payload.channel?.id ??
		payload.event?.assistant_thread?.context?.channel_id;
	const channelInfo = await getChannelInfo(teamId, channelId);
	// console.log("channelInfo", channelInfo, teamId, channelId);

	// Do not respond to bot messages
	if (payload.event?.bot_profile) {
		console.log("exit[botmsg]", payload.event.bot_profile);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to message edits
	if (payload.event?.subtype) {
		console.log("exit[subtype]", payload.event.subtype);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to messages unless they are a naked link
	if (payload.event?.type === "message" && !isNakedLink(payload)) {
		console.log("exit[nakedlink]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to naked mentions
	if (isNakedMention(payload)) {
		console.log("exit[nakedmention]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	if (payload.event?.type === "assistant_thread_started") {
		const event = payload.event as AssistantThreadStartedEvent;

		const result = await fetch(
			"https://slack.com/api/assistant.threads.setSuggestedPrompts",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${channelInfo.token}`,
				},
				body: JSON.stringify({
					channel_id: event.assistant_thread.channel_id,
					thread_ts: event.assistant_thread.thread_ts,
					title: "Trustworthy answers to any question, such as:",
					prompts: getThreeRandomStarters().map((starter) => ({
						title: starter,
						message: starter,
					})),
				}),
			},
		);
		console.log(
			"result[assistant_thread_started]",
			result.status,
			await result.json(),
		);
		return NextResponse.json({ status: "ok" });
	}
	if (payload.event?.type === "assistant_thread_context_changed") {
		console.log("exit[assistant_thread_context_changed]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}

	const app = await SlackDb.entities.get(payload.api_app_id);
	const callbackUrl = app?.metadata?.callback ?? "https://api.proem.ai";

	const metadata = {
		callback: `${callbackUrl}/slack/events/outbound`,
		appId: payload.api_app_id,
		eventId: payload.event_id ?? uuid(),
		teamId,
		channel: channelInfo.channel,
	};
	console.log(metadata);

	await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});

	const result = await fetch(process.env.N8N_WEBHOOK_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			metadata,
			payload,
		}),
	});

	return NextResponse.json({ body: payload, result });
}

type AssistantThreadStartedEvent = {
	type: "assistant_thread_started";
	assistant_thread: {
		user_id: string;
		context: {
			channel_id: string;
			team_id: string;
			enterprise_id: string;
		};
		channel_id: string;
		thread_ts: string;
	};
	event_ts: string;
};

const STARTERS = [
	"Do vaccines cause autism spectrum disorder?",
	"Is a daily glass of wine healthy?",
	"Do cell phones cause brain cancer?",
	"What is the universe made of?",
	"How can I lower my blood pressure?",
	"What can I do for heartburn relief?",
	"Is microwaved food unsafe?",
	"Why do we dream?",
	"What is the theory of evolution by natural selection?",
	"What is the structure of DNA?",
	"What causes the seasons?",
	"How do vaccines work?",
	"What is photosynthesis?",
	"What are the laws of thermodynamics?",
	"What is the Big Bang Theory?",
	"How does antibiotic resistance develop?",
	"What is plate tectonics?",
	"How do black holes form?",
	"What is quantum mechanics?",
	"What causes earthquakes?",
	"What is the greenhouse effect?",
	"What are stem cells?",
	"What is the process of natural selection?",
	"How does the water cycle work?",
	"What is relativity theory?",
	"What causes global warming?",
	"How does photosynthesis contribute to the oxygen cycle?",
	"What is the function of mitochondria in cells?",
	"Is solar or nuclear power better for CO2?",
	"Do mask lower virus spread?",
	"Does plastic waste impact ocean ecosystems?",
	"Can technology improve learning outcomes?",
	"Could no-till farming improve soil conservation?",
	"Are electric cars better over their lifecycle?",
	"Can greywater recycling improve urban life?",
	"Can urban parks lower temperature and pollution?",
	"Does community policing reduce urban crime?",
	"Are immunotherapy or chemo more effective?",
	"Is online therapy effective?",
	"Do organic foods have less pesticides?",
	"Does net neutrality spur innovation?",
	"Can zero-waste policies reduce landfill?",
	"Best way to heal strain injuries?",
	"Do solar subsidies increase adoption?",
	"Explain impacts of rent control on housing markets",
	"Best early warning systems to reduce casualties?",
	"Do fruits and vegetables lower chronic disease?",
	"Do marine protected areas improve biodiversity?",
	"Can reforestation increase carbon emissions?",
	"Do electric cars increase pollution?",
	"Can vaccination lead to spikes in disease?",
	"Will increased health spending reduce total costs?",
	"Can pollution control worsen greenhouse emissions?",
	"Does organic farming increase water usage?",
	"Can homework worsen educational outcomes?",
	"Can smaller classes lead to lower achievement?",
	"Can GMO crops enhance biodiversity?",
	"Does organic farming produce more greenhouse gases?",
	"Is nuclear power safer than solar power?",
	"Do biofuels increase total carbon emissions?",
	"Can desalination worsen water scarcity?",
	"Does water conservation lead to higher water usage?",
	"Does high-density housing have lower energy use?",
	"Can bike lanes increase car traffic?",
	"Can street lights cause higher crime rates?",
	"Does decriminalizing reduce overall crime?",
	"Does fast-tracking drugs reduce patient safety?",
	"Do strict drug regulation increase prices?",
	"Can easy access to mental health services increase reported issues?",
	"Does social media decrease loneliness in older adults?",
	"Does strict food safety increase food waste?",
	"Do preservatives reduce foodborne illness?",
	"Can increased internet regulation improve online security?",
	// "Do data caps foster internet innovation?",
	"Can recycling increase overall energy consumption?",
	"Is banning plastic bags increase eco-friendly?",
	// "Can ergonomic keyboards cause repetitive strain injuries?",
	"Do subsidies slow innovation in energy storage?",
	"Do renewable energy incentives cause lower gas prices?",
	"Can affordable housing increase housing prices?",
	// "Do rent freezes lead to decreased housing quality?",
	"Can early disaster evacuations increase casualties?",
	"Can seawalls increase damage from storm surges?",
	"Can dietary supplements cause health issues?",
	"Do artificial sweeteners with health risks?",
	"Can sustainable fishing decrease biodiversity?",
	"Do marine sanctuaries cause fishing in more vulnerable areas?",
	"Do solar farms disrupt local ecosystems?",
	"Do park projects cause gentrification?",
	"Do flu vaccinations cause flu-like symptoms?",
	"Has antibiotics decreased vaccine effectiveness?",
	"Do LED lights increase light pollution?",
	"Do electric vehicle batteries pollute landfills?",
	"Has online learning widened the achievement gap?",
	"Does bilingual education delay language proficiency?",
	"Does crop rotation reduce soil quality?",
	"Have biofuel subsidies raised food prices?",
	"Do wind turbines harm bird populations?",
	"Do energy-efficient appliances consume more energy?",
	"Has bottled water consumption degraded municipal systems?",
	"Do water-saving fixtures lead to increased water use?",
	"Do pedestrian zones increase carbon emissions?",
	"Have smart cities raised privacy concerns?",
	"Do gun buyback programs reduce violent crime?",
	"Have body cameras reduced police misconduct?",
	"Do expedited approvals increase drug recalls?",
	"Does off-label use improve patient outcomes?",
	"Has school screening reduced mental health issues?",
	"Do mental health apps increase anxiety?",
	"Has GMO labeling decreased consumer trust?",
	"Do farm-to-table initiatives increase illness?",
	"Has rural broadband spurred economic growth?",
	"Do unlimited plans increase network congestion?",
	"Do composting programs attract urban pests?",
	"Does single-stream recycling increase contamination?",
	"Do open offices spread diseases?",
	"Do standing desks reduce health issues?",
	// "Do solar subsidies benefit wealthier households?",
	"Do energy credits reduce greenhouse gas emissions?",
	"Does inclusionary zoning reduce housing development?",
	// "Do rental regulations stabilize housing markets?",
	"Do earthquake warnings reduce injuries?",
	"Do recovery funds reinforce inequalities?",
	"Have low-fat diets increased obesity?",
	"Do school programs improve dietary habits?",
	"Do catch share programs lead to overfishing?",
	"Have artificial reefs improved biodiversity?",
];

export const getThreeRandomStarters = () =>
	[...STARTERS].sort(() => 0.5 - Math.random()).slice(0, 3);
