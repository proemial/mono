import { Theme } from "@/app/theme/color-theme";
import { ReactElement } from "react";

export type Field = {
	displayName: string;
	icon: ReactElement;
	theme: Theme;
};

export const oaFieldConfigMap: Record<string, Field> = {
	"https://openalex.org/fields/22": {
		displayName: "Engineering",
		theme: {
			image: "silicon",
			color: "purple",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12.8799 1.36499H1.11988C0.849283 1.36499 0.629883 1.58439 0.629883 1.85499V9.69499C0.629883 9.96559 0.849283 10.185 1.11988 10.185H12.8799C13.1505 10.185 13.3699 9.96559 13.3699 9.69499V1.85499C13.3699 1.58439 13.1505 1.36499 12.8799 1.36499Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6.02004 10.185L5.04004 12.635"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M7.97998 10.185L8.95998 12.635"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.06006 12.635H9.94006"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.54996 4.54999L2.83496 6.01999L4.30496 7.24499"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.69471 4.79498L11.1647 6.01998L9.44971 7.48998"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6.26465 7.97998L7.73465 3.56998"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/17": {
		displayName: "Computer Science",
		theme: {
			image: "silicon",
			color: "teal",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.75 0.5V2M10.25 0.5V2M5.75 14V15.5M10.25 14V15.5M14 5.75H15.5M14 9.5H15.5M0.5 5.75H2M0.5 9.5H2M5.6 14H10.4C11.6601 14 12.2901 14 12.7715 13.7548C13.1949 13.5391 13.5391 13.1949 13.7548 12.7715C14 12.2901 14 11.6601 14 10.4V5.6C14 4.33988 14 3.70982 13.7548 3.22852C13.5391 2.80516 13.1949 2.46095 12.7715 2.24524C12.2901 2 11.6601 2 10.4 2H5.6C4.33988 2 3.70982 2 3.22852 2.24524C2.80516 2.46095 2.46095 2.80516 2.24524 3.22852C2 3.70982 2 4.33988 2 5.6V10.4C2 11.6601 2 12.2901 2.24524 12.7715C2.46095 13.1949 2.80516 13.5391 3.22852 13.7548C3.70982 14 4.33988 14 5.6 14ZM6.95 10.25H9.05C9.47007 10.25 9.68008 10.25 9.8405 10.1682C9.98165 10.0963 10.0963 9.98165 10.1682 9.8405C10.25 9.68008 10.25 9.47007 10.25 9.05V6.95C10.25 6.52993 10.25 6.31994 10.1682 6.15951C10.0963 6.01839 9.98165 5.90365 9.8405 5.83174C9.68008 5.75 9.47007 5.75 9.05 5.75H6.95C6.52993 5.75 6.31994 5.75 6.15951 5.83174C6.01839 5.90365 5.90365 6.01839 5.83174 6.15951C5.75 6.31994 5.75 6.52993 5.75 6.95V9.05C5.75 9.47007 5.75 9.68008 5.83174 9.8405C5.90365 9.98165 6.01839 10.0963 6.15951 10.1682C6.31994 10.25 6.52993 10.25 6.95 10.25Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/23": {
		displayName: "Environmental Science",
		theme: {
			image: "silicon",
			color: "green",
		},
		icon: (
			<svg
				width="16"
				height="12"
				viewBox="0 0 16 12"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0.5 1.5C0.95 1.875 1.4 2.25 2.375 2.25C4.25 2.25 4.25 0.75 6.125 0.75C7.1 0.75 7.55 1.125 8 1.5C8.45 1.875 8.9 2.25 9.875 2.25C11.75 2.25 11.75 0.75 13.625 0.75C14.6 0.75 15.05 1.125 15.5 1.5M0.5 10.5C0.95 10.875 1.4 11.25 2.375 11.25C4.25 11.25 4.25 9.75 6.125 9.75C7.1 9.75 7.55 10.125 8 10.5C8.45 10.875 8.9 11.25 9.875 11.25C11.75 11.25 11.75 9.75 13.625 9.75C14.6 9.75 15.05 10.125 15.5 10.5M0.5 6C0.95 6.375 1.4 6.75 2.375 6.75C4.25 6.75 4.25 5.25 6.125 5.25C7.1 5.25 7.55 5.625 8 6C8.45 6.375 8.9 6.75 9.875 6.75C11.75 6.75 11.75 5.25 13.625 5.25C14.6 5.25 15.05 5.625 15.5 6"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/31": {
		displayName: "Physics and Astronomy",
		theme: {
			image: "silicon",
			color: "rose",
		},
		icon: (
			<svg
				width="15"
				height="16"
				viewBox="0 0 15 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7.39611 8.00007H7.40361M10.0477 10.6518C6.53308 14.1665 2.49662 15.8285 1.03216 14.364C-0.432307 12.8996 1.22975 8.86317 4.74447 5.34846C8.25921 1.83374 12.2956 0.17168 13.7601 1.63614C15.2245 3.10061 13.5625 7.13705 10.0477 10.6518ZM10.0477 5.34832C13.5625 8.86302 15.2245 12.8995 13.7601 14.3639C12.2956 15.8284 8.25914 14.1663 4.74444 10.6516C1.22972 7.1369 -0.432337 3.10047 1.03213 1.63601C2.49659 0.171545 6.53301 1.8336 10.0477 5.34832ZM7.77111 8.00007C7.77111 8.20722 7.60326 8.37507 7.39611 8.37507C7.18904 8.37507 7.02111 8.20722 7.02111 8.00007C7.02111 7.793 7.18904 7.62507 7.39611 7.62507C7.60326 7.62507 7.77111 7.793 7.77111 8.00007Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/25": {
		displayName: "Materials Science",
		theme: {
			image: "silicon",
			color: "gold",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6.3125 14.5626L7.41725 15.1763C7.62995 15.2945 7.7363 15.3535 7.84895 15.3767C7.94863 15.3972 8.05137 15.3972 8.15112 15.3767C8.2637 15.3535 8.37005 15.2945 8.58275 15.1763L9.6875 14.5626M2.9375 12.6876L1.86723 12.093C1.64259 11.9682 1.53026 11.9058 1.44847 11.817C1.37612 11.7385 1.32136 11.6455 1.28786 11.5441C1.25 11.4295 1.25 11.301 1.25 11.0439V9.87508M1.25 6.12507V4.95615C1.25 4.69917 1.25 4.57068 1.28786 4.45608C1.32136 4.35469 1.37612 4.26163 1.44847 4.18312C1.53026 4.09436 1.64259 4.03196 1.86723 3.90716L2.9375 3.31257M6.3125 1.43756L7.41725 0.823828C7.62995 0.705658 7.7363 0.646573 7.84895 0.623405C7.94863 0.602908 8.05137 0.602908 8.15112 0.623405C8.2637 0.646573 8.37005 0.705658 8.58275 0.823828L9.6875 1.43756M13.0625 3.31256L14.1328 3.90716C14.3575 4.03196 14.4697 4.09436 14.5515 4.18312C14.6238 4.26163 14.6787 4.35469 14.7121 4.45608C14.75 4.57068 14.75 4.69917 14.75 4.95615V6.12506M14.75 9.87508V11.0439C14.75 11.301 14.75 11.4295 14.7121 11.5441C14.6787 11.6455 14.6238 11.7385 14.5515 11.817C14.4697 11.9058 14.3575 11.9682 14.1328 12.093L13.0625 12.6876M6.3125 7.06258L8 8.00008M8 8.00008L9.6875 7.06258M8 8.00008V9.87508M1.25 4.25006L2.9375 5.18756M13.0625 5.18756L14.75 4.25006M8 13.6251V15.5001"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/16": {
		displayName: "Chemistry",
		theme: {
			image: "leafs",
			color: "purple",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.00001 0.5V6.5L12.59 11.07C12.7649 11.2913 12.8738 11.5574 12.9043 11.8378C12.9348 12.1182 12.8856 12.4015 12.7624 12.6552C12.6392 12.9089 12.447 13.1228 12.2078 13.2722C11.9686 13.4216 11.6921 13.5006 11.41 13.5H2.59001C2.30797 13.5006 2.03147 13.4216 1.79225 13.2722C1.55304 13.1228 1.36079 12.9089 1.23759 12.6552C1.11439 12.4015 1.06521 12.1182 1.09571 11.8378C1.12621 11.5574 1.23514 11.2913 1.41001 11.07L5.00001 6.5V0.5"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M3.5 0.5H10.5"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/19": {
		displayName: "Earth and Planetary Sciences",
		theme: {
			image: "leafs",
			color: "teal",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M1 9.49995H2.75C3.21413 9.49995 3.65925 9.31557 3.98744 8.98738C4.31563 8.6592 4.5 8.21407 4.5 7.74995V6.24995C4.5 5.78582 4.68437 5.3407 5.01256 5.01251C5.34075 4.68432 5.78587 4.49995 6.25 4.49995C6.71413 4.49995 7.15925 4.31557 7.48744 3.98738C7.81563 3.65919 8 3.21408 8 2.74995V0.569946"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.5 6.9C12.9993 6.64021 12.4441 6.50311 11.88 6.5H9.75C9.28587 6.5 8.84075 6.68437 8.51256 7.01256C8.18437 7.34075 8 7.78587 8 8.25C8 8.71413 8.18437 9.15925 8.51256 9.48744C8.84075 9.81563 9.28587 10 9.75 10C10.0815 10 10.3995 10.1317 10.6339 10.3661C10.8683 10.6005 11 10.9185 11 11.25V12.12"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/26": {
		displayName: "Mathematics",
		theme: {
			image: "leafs",
			color: "green",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 4.49996C1.17544 3.83329 1.85984 2.75631 3.10525 2.49997C4.66374 2.17921 12.9999 1 12.9999 1"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.99999 2.18752C4.99999 4.68749 4.96167 10.4736 3 12.9999"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M10 1.43752V11.9473C10 12.2982 10.24 12.9999 11.2 12.9999C12.16 12.9999 12.8 12.2982 13 11.9473"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/21": {
		displayName: "Energy",
		theme: {
			image: "leafs",
			color: "rose",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8 0.5V15.5M13.3033 2.6967L2.6967 13.3033M15.5 8H0.5M13.3033 13.3033L2.6967 2.6967"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/15": {
		displayName: "Chemical Engineering",
		theme: {
			image: "leafs",
			color: "gold",
		},
		icon: (
			<svg
				width="18"
				height="19"
				viewBox="0 0 18 19"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M13.2915 9.18658C13.3912 9.36604 13.441 9.45577 13.4606 9.55075C13.4779 9.63491 13.4779 9.7216 13.4606 9.80577C13.441 9.90075 13.3912 9.99048 13.2915 10.1699L10.6901 14.8526C10.5848 15.0422 10.5321 15.1369 10.4573 15.2059C10.391 15.2669 10.3125 15.3132 10.2269 15.3414C10.1302 15.3734 10.0218 15.3734 9.80504 15.3734H4.66859C4.45177 15.3734 4.34336 15.3734 4.24667 15.3414C4.16113 15.3132 4.08261 15.2669 4.01636 15.2059C3.94148 15.1369 3.88883 15.0422 3.78354 14.8526L1.18207 10.1699C1.08237 9.99048 1.03252 9.90075 1.01298 9.80577C0.995675 9.7216 0.995675 9.63491 1.01298 9.55075C1.03252 9.45577 1.08237 9.36604 1.18207 9.18658L3.78354 4.50392C3.88883 4.31439 3.94148 4.21962 4.01636 4.15061C4.08261 4.08956 4.16113 4.04336 4.24667 4.0151C4.34336 3.98315 4.45177 3.98315 4.66859 3.98315H9.80504C10.0218 3.98315 10.1302 3.98315 10.2269 4.0151C10.3125 4.04336 10.391 4.08956 10.4573 4.15061C10.5321 4.21962 10.5848 4.31439 10.6901 4.50392L13.2915 9.18658Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.7456 9.67825H17"
					stroke="currentColor"
					stroke-linecap="round"
				/>
				<path
					d="M2.13818 1L3.87197 3.75404"
					stroke="currentColor"
					strokeLinecap="round"
				/>
				<path
					d="M4.19971 15.3191L2.3124 17.9703"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/27": {
		displayName: "Medicine",
		theme: {
			image: "paint",
			color: "purple",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6.59002 1.69002C7.34854 0.931503 8.37731 0.505371 9.45002 0.505371C10.5227 0.505371 11.5515 0.931503 12.31 1.69002C13.0685 2.44854 13.4947 3.47731 13.4947 4.55002C13.4947 5.62273 13.0685 6.6515 12.31 7.41002L7.41002 12.31C6.6515 13.0685 5.62273 13.4947 4.55002 13.4947C3.47731 13.4947 2.44854 13.0685 1.69002 12.31C0.931503 11.5515 0.505371 10.5227 0.505371 9.45002C0.505371 8.37731 0.931503 7.34854 1.69002 6.59002L6.59002 1.69002Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.39014 3.88989L10.1101 9.60989"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/36": {
		displayName: "Health Professions",
		theme: {
			image: "paint",
			color: "teal",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M15.5 8H12.5L10.25 14.75L5.75 1.25L3.5 8H0.5"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/29": {
		displayName: "Nursing",
		theme: {
			image: "paint",
			color: "green",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7.9949 2.85186C6.49535 1.0988 3.99481 0.627232 2.11602 2.23251C0.23723 3.83779 -0.0272721 6.52175 1.44815 8.4203C2.67487 9.99883 6.38733 13.3281 7.60408 14.4056C7.7402 14.5262 7.8083 14.5864 7.88765 14.6101C7.95695 14.6308 8.03277 14.6308 8.10207 14.6101C8.18142 14.5864 8.24953 14.5262 8.38565 14.4056C9.60238 13.3281 13.3149 9.99883 14.5416 8.4203C16.017 6.52175 15.7848 3.8209 13.8737 2.23251C11.9626 0.644121 9.49438 1.0988 7.9949 2.85186Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/35": {
		displayName: "Dentistry",
		theme: {
			image: "paint",
			color: "green",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0.754 4.20011C1.1211 0.859211 4.0601 0.537211 6.0618 1.69701C6.6909 2.06161 7.3095 2.06161 7.9386 1.69701C9.9403 0.537211 12.8792 0.859211 13.2464 4.20011C13.6147 7.55171 11.7273 11.0975 10.7167 12.4554C10.4868 12.7643 10.1156 12.9119 9.7305 12.9119C9.0993 12.9119 8.5359 12.5161 8.3218 11.9224L7.9649 10.9322C7.8183 10.5256 7.4324 10.2545 7.0002 10.2545C6.5679 10.2545 6.1821 10.5256 6.0355 10.9322L5.6785 11.9224C5.4645 12.5161 4.901 12.9119 4.2699 12.9119C3.8848 12.9119 3.5136 12.7643 3.2837 12.4554C2.2731 11.0975 0.3857 7.55171 0.754 4.20011Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8.46402 4.36731C7.26192 4.80561 6.61612 4.79671 5.53662 4.36731"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/13": {
		displayName: "Biochemistry, Genetics and Molecular Biology",
		theme: {
			image: "paint",
			color: "rose",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10.1001 3.8999C11.1801 4.36143 12.3948 4.39716 13.5001 3.9999"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4 13.4999C4.3969 12.3911 4.36119 11.1735 3.9 10.0899C3.53902 9.22708 3.44135 8.27677 3.6193 7.35858C3.79724 6.44039 4.24284 5.59537 4.9 4.92988C5.57367 4.26318 6.42964 3.81084 7.36 3.62988"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6.6001 10.37C7.53498 10.1875 8.39463 9.7316 9.0701 9.06C9.7284 8.39523 10.1748 7.55016 10.3528 6.63168C10.5308 5.7132 10.4324 4.76257 10.0701 3.9C9.61831 2.81616 9.5933 1.60152 10.0001 0.5"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M0.5 10.0001C1.60575 9.60091 2.82236 9.64027 3.9 10.1101"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.93994 4.92993L9.06994 9.05993"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/11": {
		displayName: "Agricultural and Biological Sciences",
		theme: {
			image: "paint",
			color: "gold",
		},
		icon: (
			<svg
				width="14"
				height="12"
				viewBox="0 0 14 12"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11.8888 4.39294C11.0451 5.12728 9.71805 5.00215 9.02653 4.12305C8.33502 3.24396 8.52593 1.92475 9.4383 1.27777C10.2915 0.603143 12.9999 0.999983 12.9999 0.999983C12.9999 0.999983 12.7519 3.71831 11.8888 4.39294Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2.97311 6.07301C3.71196 6.71613 4.87417 6.60655 5.47978 5.83666C6.08492 5.06738 5.90912 3.905 5.11917 3.34482C4.37196 2.75401 2 3.10155 2 3.10155C2 3.10155 2.21721 5.4822 2.97311 6.07301Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M0.5 11C0.5 11 2.5 9 7 9C11.5 9 13.5 11 13.5 11"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.11883 4.23608L8.98576 4.36033C7.98576 5.36033 7.096 7.6639 6.99997 9C6.99997 7.41704 6.69461 6.71448 5.58013 5.81991L5.53125 5.77344"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/28": {
		displayName: "Neuroscience",
		theme: {
			image: "fingerprint",
			color: "purple",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4.61941 1.43823C5.93392 1.43823 6.99955 2.50386 6.99955 3.81837L6.99949 10.2888C6.99949 11.7932 5.77989 13.0128 4.27544 13.0128C2.77098 13.0128 1.55138 11.7932 1.55138 10.2888C1.55138 10.2117 1.55459 10.1354 1.56087 10.0599C0.993933 9.45085 0.63623 8.25951 0.63623 7.26549C0.63623 5.911 1.30039 4.59405 2.2531 4.07638C2.24396 3.99163 2.23927 3.90555 2.23927 3.81837C2.23927 2.50386 3.3049 1.43823 4.61941 1.43823Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M3.51091 5.69409C3.16143 5.61441 2.36949 5.09505 2.25 4.08252"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.96973 8.36479C6.39724 8.20546 6.96293 6.69896 6.99971 6.08618"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2.28949 8.63184C1.93393 8.91258 1.65044 9.54882 1.55859 10.0585"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.38014 1.43823C8.06562 1.43823 7 2.50386 7 3.81837L7.00006 10.2888C7.00006 11.7932 8.21966 13.0128 9.72411 13.0128C11.2286 13.0128 12.4482 11.7932 12.4482 10.2888C12.4482 10.2117 12.445 10.1354 12.4387 10.0599C13.0056 9.45085 13.3633 8.25951 13.3633 7.26549C13.3633 5.911 12.6992 4.59405 11.7465 4.07638C11.7556 3.99163 11.7603 3.90555 11.7603 3.81837C11.7603 2.50386 10.6947 1.43823 9.38014 1.43823Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M10.4883 5.69409C10.8378 5.61441 11.6297 5.09505 11.7492 4.08252"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.02949 8.36479C7.60199 8.20546 7.03629 6.69896 6.99951 6.08618"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11.71 8.63184C12.0655 8.91258 12.349 9.54882 12.4409 10.0585"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/24": {
		displayName: "Immunology and Microbiology",
		theme: {
			image: "fingerprint",
			color: "teal",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8 0.5V4.25M8 0.5C7.46503 0.5 6.94318 0.556002 6.43993 0.662472M8 0.5C8.5349 0.5 9.05682 0.556002 9.56 0.662472M8 4.25C5.92891 4.25 4.25 5.92895 4.25 8M8 4.25C10.071 4.25 11.75 5.92895 11.75 8M4.25 8C4.25 10.071 5.92891 11.75 8 11.75M4.25 8H0.5M11.75 8C11.75 10.071 10.071 11.75 8 11.75M11.75 8H15.5M8 11.75V15.5M8 15.5C8.53415 15.5 9.05525 15.4441 9.55775 15.338M8 15.5C7.46382 15.5 6.94085 15.4438 6.43659 15.3368M2.69668 2.6967L5.34833 5.34835M10.6516 10.6516L13.3032 13.3033M0.5 8C0.5 8.53497 0.555995 9.0569 0.66248 9.56015M0.5 8C0.5 7.46428 0.55616 6.9416 0.662952 6.43762M15.5 8C15.5 7.46503 15.444 6.9431 15.3375 6.43983M15.5 8C15.5 8.53483 15.4441 9.05645 15.3376 9.55955M2.69668 13.3033L5.34833 10.6516M10.6516 5.34835L13.3032 2.6967M12.0849 1.70906C12.9657 2.28214 13.7187 3.03517 14.2916 3.91602M14.2895 12.0872C13.7165 12.9672 12.9637 13.7195 12.0834 14.292M3.91528 14.2912C3.03578 13.7189 2.28373 12.9672 1.71105 12.0881M1.70878 3.9154C2.28159 3.03496 3.03421 2.28225 3.91456 1.70933"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/30": {
		displayName: "Pharmacology, Toxicology and Pharmaceutics",
		theme: {
			image: "fingerprint",
			color: "green",
		},
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1.53228 8.38438L1.31059 6.41406C1.24389 5.82123 1.70776 5.30225 2.30432 5.30225H11.6955C12.292 5.30225 12.7559 5.82123 12.6892 6.41406L12.4675 8.38438C12.3214 9.68286 11.5643 10.7779 10.5024 11.3959C10.672 11.7014 10.7902 12.041 10.8446 12.404C10.9123 12.856 10.5622 13.2624 10.1052 13.2624H3.8946C3.43757 13.2624 3.08748 12.856 3.15518 12.404C3.20955 12.041 3.32774 11.7014 3.49732 11.3959C2.43548 10.7779 1.67838 9.68285 1.53228 8.38438Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M7.46875 5.2812L9.84203 1.56137C10.1952 1.00777 10.9282 0.841734 11.4855 1.18911C12.0545 1.54379 12.2216 2.29639 11.8562 2.85854L10.2813 5.2812"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5.25098 9.28247H8.74854"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M7 7.53369V11.0312"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/33": {
		displayName: "Social Sciences",
		theme: {
			image: "fingerprint",
			color: "rose",
		},
		icon: (
			<svg
				width="15"
				height="16"
				viewBox="0 0 15 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2 5.75001V11.75M5.375 5.75001V11.75M9.125 5.75001V11.75M12.5 5.75001V11.75M0.5 12.95V13.55C0.5 13.9701 0.5 14.1801 0.581742 14.3405C0.653652 14.4817 0.768388 14.5964 0.909508 14.6683C1.06994 14.75 1.27996 14.75 1.7 14.75H12.8C13.2201 14.75 13.4301 14.75 13.5905 14.6683C13.7317 14.5964 13.8463 14.4817 13.9183 14.3405C14 14.1801 14 13.9701 14 13.55V12.95C14 12.53 14 12.3199 13.9183 12.1595C13.8463 12.0184 13.7317 11.9037 13.5905 11.8317C13.4301 11.75 13.2201 11.75 12.8 11.75H1.7C1.27996 11.75 1.06994 11.75 0.909508 11.8317C0.768388 11.9037 0.653652 12.0184 0.581742 12.1595C0.5 12.3199 0.5 12.53 0.5 12.95ZM6.98967 1.30786L1.43968 2.5412C1.10439 2.6157 0.93674 2.65296 0.811595 2.74311C0.701218 2.82264 0.614548 2.93069 0.560863 3.05569C0.5 3.1974 0.5 3.36915 0.5 3.71262V4.55001C0.5 4.97005 0.5 5.18007 0.581742 5.34051C0.653652 5.48163 0.768388 5.59636 0.909508 5.66827C1.06994 5.75001 1.27996 5.75001 1.7 5.75001H12.8C13.2201 5.75001 13.4301 5.75001 13.5905 5.66827C13.7317 5.59636 13.8463 5.48163 13.9183 5.34051C14 5.18007 14 4.97005 14 4.55001V3.71262C14 3.36915 14 3.19741 13.9391 3.05569C13.8855 2.93069 13.7988 2.82264 13.6884 2.74311C13.5633 2.65296 13.3957 2.6157 13.0603 2.5412L7.51033 1.30786C7.4132 1.28628 7.3646 1.27548 7.31555 1.27118C7.2719 1.26735 7.2281 1.26735 7.18445 1.27118C7.1354 1.27548 7.0868 1.28628 6.98967 1.30786Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/12": {
		displayName: "Arts and Humanities",
		theme: {
			image: "fingerprint",
			color: "gold",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8.75 3.49989L3.87637 4.47461C3.60412 4.52906 3.468 4.55628 3.35714 4.62249C3.25914 4.68102 3.17579 4.76114 3.11345 4.85676C3.04293 4.96491 3.01036 5.09985 2.94521 5.36974L0.5 15.4998M0.5 15.4998L10.6302 13.0547C10.9 12.9895 11.0349 12.957 11.1431 12.8865C11.2387 12.8241 11.3189 12.7407 11.3774 12.6427C11.4436 12.5319 11.4708 12.3957 11.5253 12.1235L12.5 7.24985M0.5 15.4998L6.1895 9.81035M14.6515 4.90136L11.0985 1.34841C10.8015 1.0514 10.653 0.902891 10.4818 0.847256C10.3312 0.798311 10.1688 0.798311 10.0182 0.847256C9.84702 0.902891 9.69845 1.0514 9.40145 1.34841L8.84855 1.90136C8.55155 2.19837 8.40297 2.34687 8.3474 2.51812C8.29842 2.66876 8.29842 2.83101 8.3474 2.98165C8.40297 3.15289 8.55155 3.3014 8.84855 3.59841L12.4015 7.15137C12.6985 7.44837 12.847 7.59687 13.0182 7.65252C13.1688 7.70142 13.3312 7.70142 13.4818 7.65252C13.653 7.59687 13.8015 7.44837 14.0985 7.15137L14.6515 6.5984C14.9485 6.3014 15.097 6.15289 15.1526 5.98165C15.2016 5.83101 15.2016 5.66876 15.1526 5.51812C15.097 5.34687 14.9485 5.19837 14.6515 4.90136ZM7.25 7.24985C8.07845 7.24985 8.75 7.92147 8.75 8.74985C8.75 9.5783 8.07845 10.2498 7.25 10.2498C6.42157 10.2498 5.75 9.5783 5.75 8.74985C5.75 7.92147 6.42157 7.24985 7.25 7.24985Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/14": {
		displayName: "Business, Management and Accounting",
		theme: {
			color: "purple",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4.625 7.25H2.45C2.02996 7.25 1.81994 7.25 1.65951 7.33175C1.51839 7.40368 1.40365 7.51835 1.33174 7.6595C1.25 7.81992 1.25 8.02993 1.25 8.45V14.75M11.375 7.25H13.55C13.9701 7.25 14.1801 7.25 14.3405 7.33175C14.4817 7.40368 14.5963 7.51835 14.6683 7.6595C14.75 7.81992 14.75 8.02993 14.75 8.45V14.75M11.375 14.75V3.65C11.375 2.80992 11.375 2.38988 11.2115 2.06902C11.0677 1.78677 10.8382 1.5573 10.556 1.41349C10.2351 1.25 9.81508 1.25 8.975 1.25H7.025C6.18492 1.25 5.76488 1.25 5.44402 1.41349C5.16177 1.5573 4.9323 1.78677 4.78849 2.06902C4.625 2.38988 4.625 2.80992 4.625 3.65V14.75M15.5 14.75H0.5M7.25 4.25H8.75M7.25 7.25H8.75M7.25 10.25H8.75"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/20": {
		displayName: "Economics, Econometrics and Finance",
		theme: {
			color: "teal",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M14.75 14.75H3.65C2.80992 14.75 2.38988 14.75 2.06902 14.5865C1.78677 14.4427 1.5573 14.2132 1.41349 13.931C1.25 13.6102 1.25 13.1901 1.25 12.35V1.25M4.25 6.875V12.125M7.625 3.125V12.125M11 6.875V12.125M14.375 3.125V12.125"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/32": {
		displayName: "Psychology",
		theme: {
			color: "green",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4.25 5.375H8M4.25 8H10.25M4.25 12.5V14.2516C4.25 14.6513 4.25 14.8511 4.33192 14.9537C4.40317 15.043 4.5112 15.0949 4.6254 15.0948C4.75672 15.0946 4.91275 14.9698 5.22482 14.7201L7.0139 13.2888C7.37937 12.9965 7.56215 12.8503 7.76562 12.7464C7.94615 12.6541 8.1383 12.5867 8.3369 12.546C8.56077 12.5 8.79477 12.5 9.26277 12.5H11.15C12.4102 12.5 13.0401 12.5 13.5215 12.2548C13.9449 12.0391 14.2891 11.6949 14.5048 11.2715C14.75 10.7901 14.75 10.1601 14.75 8.9V4.85C14.75 3.58988 14.75 2.95982 14.5048 2.47852C14.2891 2.05516 13.9449 1.71095 13.5215 1.49524C13.0401 1.25 12.4102 1.25 11.15 1.25H4.85C3.58988 1.25 2.95982 1.25 2.47852 1.49524C2.05516 1.71095 1.71095 2.05516 1.49524 2.47852C1.25 2.95982 1.25 3.58988 1.25 4.85V9.5C1.25 10.1975 1.25 10.5462 1.32667 10.8324C1.53472 11.6088 2.1412 12.2153 2.91765 12.4234C3.20378 12.5 3.55252 12.5 4.25 12.5Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	"https://openalex.org/fields/18": {
		displayName: "Decision Sciences",
		theme: {
			color: "rose",
		},
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11.75 14H11.6C10.3398 14 9.70985 14 9.2285 13.7548C8.80512 13.5391 8.46095 13.1949 8.24525 12.7715C8 12.2901 8 11.6601 8 10.4V5.6C8 4.33988 8 3.70982 8.24525 3.22852C8.46095 2.80516 8.80512 2.46095 9.2285 2.24524C9.70985 2 10.3398 2 11.6 2H11.75M11.75 14C11.75 14.8284 12.4216 15.5 13.25 15.5C14.0784 15.5 14.75 14.8284 14.75 14C14.75 13.1716 14.0784 12.5 13.25 12.5C12.4216 12.5 11.75 13.1716 11.75 14ZM11.75 2C11.75 2.82843 12.4216 3.5 13.25 3.5C14.0784 3.5 14.75 2.82843 14.75 2C14.75 1.17157 14.0784 0.5 13.25 0.5C12.4216 0.5 11.75 1.17157 11.75 2ZM4.25 8H11.75M4.25 8C4.25 8.82845 3.57843 9.5 2.75 9.5C1.92157 9.5 1.25 8.82845 1.25 8C1.25 7.17155 1.92157 6.5 2.75 6.5C3.57843 6.5 4.25 7.17155 4.25 8ZM11.75 8C11.75 8.82845 12.4216 9.5 13.25 9.5C14.0784 9.5 14.75 8.82845 14.75 8C14.75 7.17155 14.0784 6.5 13.25 6.5C12.4216 6.5 11.75 7.17155 11.75 8Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
};
