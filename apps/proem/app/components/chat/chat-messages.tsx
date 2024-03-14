"use client";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { useUser } from "@clerk/nextjs";
import { useChat } from "ai/react";
import { ChatMessage, ChatStarter } from "./chat-message";
import { limit } from "@proemial/utils/array";
import { ChatTarget, useChatState } from "./state";
import { ReactNode, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const PROEM_BOT = {
	fullName: "proem",
	initials: "P",
	avatar: "/android-chrome-512x512.png",
};

type MessagesProps = {
	target: ChatTarget;
	title: string;
	abstract: string;
	children?: ReactNode;
};

export function ChatMessages({ target, title, abstract, children }: MessagesProps) {
	const { messages, append, isLoading } = useChat({
		body: { title, abstract, model: "gpt-3.5-turbo" },
		api: "/api/bot/chat",
	});

	const { user } = useUser();
	const userProfile = getProfileFromUser(user);

	const { questions, loading, setLoading } = useChatState(target);

	useEffect(() => {
		if (setLoading) {
			setLoading(isLoading);
		}
	}, [isLoading, setLoading]);

	useEffect(() => {
		console.log("questions", questions?.length);

		if (questions?.length > 0) {
			console.log("appending question", questions?.at(-1));
			appendQuestion(questions.at(-1) as string);
		}
	}, [questions]);

	const chatWrapperRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (messages?.length > 0 && chatWrapperRef.current) {
			chatWrapperRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
		}
	}, [messages]);

	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	const handleExplainerClick = (msg: string) => {
		Tracker.track(analyticsKeys.read.click.explainer, { msg });
		appendQuestion(`What is ${msg}?`);
	};

	return (
		<div ref={chatWrapperRef} className="px-4 pb-32">
			{messages?.map((message, i) => (
				<ChatMessage
					key={i}
					message={message}
					user={userProfile}
					onExplainerClick={handleExplainerClick}
				/>
			))}
			{messages?.length === 0 && children}
		</div>
	);
}

type StartersProps = {
	target: ChatTarget;
	starters: string[];
	trackingKey: string;
};

export function StarterMessages({
	target,
	starters,
	trackingKey,
}: StartersProps) {
	const { questions, appendQuestion } = useChatState(target);

	if (questions?.length > 0) {
		return null;
	}

	const trackAndInvoke = (text: string) => {
		Tracker.track(trackingKey, {
			text,
		});

		appendQuestion(text);
	};

	return (
		<>
			<div className="flex items-center font-sourceCodePro">
				<Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
				SUGGESTED QUESTIONS
			</div>
			{limit(starters?.filter(Boolean), 3).map((question) => (
				<ChatStarter key={question} onClick={() => trackAndInvoke(question)}>
					{question}
				</ChatStarter>
			))}
		</>
	);
}
