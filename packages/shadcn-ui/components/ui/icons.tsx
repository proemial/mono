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
	organization: (props: IconProps) => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 18 17"
			stroke="currentColor"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.8 7.4H13.64C14.5361 7.4 14.9842 7.4 15.3264 7.5744C15.6274 7.72776 15.8722 7.97256 16.0256 8.2736C16.2 8.61584 16.2 9.06392 16.2 9.96V15.4M9.8 15.4V3.56C9.8 2.66392 9.8 2.21587 9.6256 1.87362C9.47224 1.57255 9.22744 1.32778 8.9264 1.17439C8.58416 1 8.13608 1 7.24 1H4.36C3.46392 1 3.01587 1 2.67362 1.17439C2.37255 1.32778 2.12778 1.57255 1.97439 1.87362C1.8 2.21587 1.8 2.66392 1.8 3.56V15.4M17 15.4H1M4.6 4.2H7M4.6 7.4H7M4.6 10.6H7"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	anonymous: (props: IconProps) => (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14.7467 12.8251C16.0837 11.935 16.9655 10.416 16.9655 8.68965C16.9655 5.94745 14.7422 3.72414 12 3.72414C9.25778 3.72414 7.03447 5.94745 7.03447 8.68965C7.03447 10.416 7.91626 11.935 9.25322 12.8251C9.25322 12.8251 9.25364 12.8255 9.25405 12.8255C9.25364 12.8255 9.25364 12.8251 9.25364 12.8251C6.05336 13.7897 3.5615 16.387 2.75916 19.6548L2.75957 19.6552C2.89033 19.8128 3.02605 19.9668 3.16467 20.1178C3.19819 20.1546 3.23336 20.1898 3.26771 20.2258C3.37447 20.3392 3.48247 20.4509 3.59336 20.5601C3.63929 20.6052 3.68605 20.6487 3.73281 20.693C3.83543 20.7906 3.93929 20.887 4.04522 20.981C4.09778 21.0273 4.15116 21.0732 4.20412 21.1188C4.30798 21.2077 4.41309 21.295 4.52026 21.3803C4.57653 21.4254 4.63322 21.4697 4.68991 21.5139C4.79833 21.5975 4.9084 21.6786 5.01971 21.7581C5.07722 21.799 5.13391 21.8408 5.19226 21.881C5.30978 21.9621 5.42936 22.0399 5.54978 22.1168C5.60398 22.1512 5.65695 22.1868 5.71157 22.2207C5.8506 22.3063 5.99212 22.3883 6.13488 22.4685C6.17253 22.4897 6.20936 22.5124 6.24743 22.5331C6.43198 22.6341 6.61943 22.7309 6.80978 22.8223C6.81433 22.8244 6.81929 22.8265 6.82384 22.8285C7.0055 22.9154 7.19005 22.9978 7.37667 23.0756C7.4346 23.1 7.49378 23.1215 7.55212 23.1447C7.68702 23.1985 7.82191 23.2514 7.95929 23.3003C8.03212 23.3263 8.10578 23.3499 8.17902 23.3748C8.30398 23.417 8.42978 23.4579 8.5564 23.4956C8.63667 23.5196 8.71736 23.5419 8.79847 23.5643C8.92095 23.5982 9.04426 23.6305 9.16881 23.6607C9.25281 23.681 9.33722 23.7004 9.42205 23.719C9.5466 23.7463 9.67157 23.7712 9.79736 23.7943C9.8826 23.8101 9.96743 23.8262 10.0535 23.8399C10.1834 23.861 10.3142 23.8788 10.4454 23.8957C10.5281 23.9065 10.6105 23.9185 10.6936 23.9272C10.8385 23.9429 10.9845 23.9541 11.1306 23.9644C11.2014 23.9694 11.2713 23.9768 11.3421 23.9805C11.5601 23.993 11.779 24 12 24C12.2209 24 12.4398 23.993 12.6579 23.9814C12.7287 23.9777 12.799 23.9702 12.8694 23.9652C13.0158 23.9549 13.1619 23.9437 13.3063 23.928C13.3895 23.9189 13.4718 23.9073 13.5546 23.8965C13.6858 23.8796 13.8165 23.8618 13.9465 23.8407C14.0321 23.8266 14.1174 23.8109 14.2026 23.7952C14.3284 23.772 14.4538 23.7472 14.5779 23.7199C14.6627 23.7012 14.7472 23.6818 14.8312 23.6615C14.9553 23.6313 15.0786 23.599 15.2015 23.5651C15.2822 23.5428 15.3633 23.5204 15.4436 23.4964C15.5706 23.4583 15.696 23.4174 15.8209 23.3756C15.8942 23.3508 15.9683 23.3272 16.0407 23.3011C16.1776 23.2519 16.3129 23.1993 16.4478 23.1455C16.5062 23.1223 16.5654 23.1004 16.6233 23.0764C16.8091 22.9986 16.9928 22.9171 17.1736 22.8302C17.179 22.8277 17.1848 22.8252 17.1902 22.8228C17.3805 22.7313 17.568 22.6345 17.7525 22.5335C17.7906 22.5128 17.8274 22.4901 17.8651 22.469C18.0078 22.3887 18.1494 22.3068 18.2884 22.2211C18.343 22.1876 18.3964 22.152 18.4502 22.1172C18.5706 22.0403 18.6902 21.9621 18.8077 21.8814C18.8656 21.8412 18.9227 21.7999 18.9803 21.7585C19.0916 21.6786 19.2016 21.5975 19.3101 21.5143C19.3672 21.4705 19.4234 21.4258 19.4797 21.3807C19.5865 21.2954 19.692 21.2081 19.7958 21.1192C19.8492 21.0737 19.9026 21.0277 19.9547 20.9814C20.0607 20.8874 20.1645 20.791 20.2672 20.6934C20.3135 20.6491 20.3607 20.6052 20.4066 20.5605C20.5175 20.4513 20.6259 20.3396 20.7323 20.2262C20.7662 20.1898 20.8014 20.1546 20.8353 20.1182C20.9739 19.9672 21.1096 19.8132 21.2404 19.6556L21.2408 19.6552C20.4389 16.387 17.947 13.7897 14.7467 12.8251Z"
				fill="black"
				fillOpacity="0.2"
			/>
		</svg>
	),
};
