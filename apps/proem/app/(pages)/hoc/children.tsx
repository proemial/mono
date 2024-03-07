"use client";
import { ProemLogo } from "@/app/components/icons/brand/logo";
import { useAskState } from "../../components/chat/state";
import { Starter } from "./starter";

export function ChildComponents() {
	return [<ChildComponent1 />, <ChildComponent2 />];
}

export function ChildComponent1() {
	const { questions } = useAskState();

	return (
		<div className="flex flex-col items-center">
			<ProemLogo includeName />
			<div className="pt-6 text-center text-md text-white/80">
				<div>answers to your questions</div>
				<div>supported by scientific research</div>
				<div>Question: {questions.map((q) => q)}</div>
			</div>
		</div>
	);
}

export function ChildComponent2() {
	return (
		<div className="flex flex-col gap-1">
			<Starter>How does photosynthesis contribute to the oxygen cycle?</Starter>
			<Starter>What is the function of mitochondria in cells?</Starter>
			<Starter>Is solar or nuclear power better for CO2?</Starter>
		</div>
	);
}
