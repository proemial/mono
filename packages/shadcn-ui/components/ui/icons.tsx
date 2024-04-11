"use client";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
	loader: (props: IconProps) => (
		<div className="loader loader--style6" title="5">
			<svg
				version="1.1"
				id="Layer_1"
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="24px"
				height="30px"
				viewBox="0 0 24 30"
				className="fill-foreground"
				{...props}
			>
				<rect x="0" y="13" width="4" height="5">
					<animate
						attributeName="height"
						attributeType="XML"
						values="5;21;5"
						begin="0s"
						dur="0.8s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="y"
						attributeType="XML"
						values="13; 5; 13"
						begin="0s"
						dur="0.8s"
						repeatCount="indefinite"
					/>
				</rect>
				<rect x="10" y="13" width="4" height="5">
					<animate
						attributeName="height"
						attributeType="XML"
						values="5;21;5"
						begin="0.15s"
						dur="0.8s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="y"
						attributeType="XML"
						values="13; 5; 13"
						begin="0.15s"
						dur="0.8s"
						repeatCount="indefinite"
					/>
				</rect>
				<rect x="20" y="13" width="4" height="5">
					<animate
						attributeName="height"
						attributeType="XML"
						values="5;21;5"
						begin="0.3s"
						dur="0.8s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="y"
						attributeType="XML"
						values="13; 5; 13"
						begin="0.3s"
						dur="0.8s"
						repeatCount="indefinite"
					/>
				</rect>
			</svg>
		</div>
	),
	throbber: (props: IconProps) => (
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				className="lucide lucide-ellipsis fill-foreground"
				{...props}
			>
				<circle cx="5" cy="12" r="2">
					<animate
						attributeName="opacity"
						attributeType="XML"
						values="0.0; 1.0; 0.0"
						begin="0s"
						dur="1s"
						repeatCount="indefinite"
					/>
				</circle>
				<circle cx="12" cy="12" r="2">
					<animate
						attributeName="opacity"
						attributeType="XML"
						values="0.0; 1.0; 0.0"
						begin="0.15s"
						dur="1s"
						repeatCount="indefinite"
					/>
				</circle>
				<circle cx="19" cy="12" r="2">
					<animate
						attributeName="opacity"
						attributeType="XML"
						values="0.0; 1.0; 0.0"
						begin="0.30s"
						dur="1s"
						repeatCount="indefinite"
					/>
				</circle>
			</svg>
		</div>
	),
	spinner: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	),
	thumbsUp: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			strokeWidth="2"
			className="lucide lucide-thumbs-up"
			{...props}
		>
			<path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
			<path d="M7 10v12" />
		</svg>
	),
	thumbsDown: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			strokeWidth="2"
			className="lucide lucide-thumbs-down"
			{...props}
		>
			<path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
			<path d="M17 14V2" />
		</svg>
	),
};
