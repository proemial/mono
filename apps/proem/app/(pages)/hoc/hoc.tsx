"use client";
import React, { forwardRef, useRef } from "react";

type ParentProps = {
	title: string;
	children: [React.ReactNode, React.ReactNode];
};

const Parent = forwardRef<HTMLDivElement, ParentProps>(
	({ title, children }, ref) => {
		const [firstChild, secondChild] = children;
		const parentRef = useRef<HTMLDivElement>(null);

		return (
			<div ref={ref}>
				<div>{title}</div>
				<div ref={parentRef}>{firstChild}</div>
				<div>{secondChild}</div>
			</div>
		);
	},
);

Parent.displayName = "Parent";

function UsingParent() {
	return (
		<Parent title="Tada!">
			<div>Tada</div>
			<ChildComponent />
		</Parent>
	);
}

function ChildComponent() {
	return <div>Child</div>;
}
