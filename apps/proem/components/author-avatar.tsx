import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Icons,
	cn,
} from "@proemial/shadcn-ui";
import { numberFrom } from "@proemial/utils/string";
import { useId } from "react";

type Props = {
	firstName: string | null;
	lastName: string | null;
	imageUrl: string | undefined;
};

export const AuthorAvatar = ({ firstName, lastName, imageUrl }: Props) => {
	const id = useId();
	const background = AVATAR_COLORS[numberFrom(id, AVATAR_COLORS.length)];

	return (
		<Avatar
			className="-ml-[18px] first:ml-0 size-6 hover:brightness-110 duration-200"
			title={getFullName(firstName, lastName)}
		>
			<AvatarImage src={imageUrl} />
			<AvatarFallback className={cn("text-xs", background)}>
				<Icons.anonymous className="size-3" />
			</AvatarFallback>
		</Avatar>
	);
};

export const getFullName = (
	firstName: string | null,
	lastName: string | null,
) => {
	if (firstName && lastName) return `${firstName} ${lastName}`;
	if (firstName) return firstName;
	if (lastName) return lastName;
	return "Anonymous";
};

export const getInitials = (
	firstName: string | null,
	lastName: string | null,
) => {
	if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
	if (firstName) return firstName[0];
	if (lastName) return lastName[0];
	return "A";
};

const AVATAR_COLORS = [
	"bg-[hsl(10,30%,72%)]",
	"bg-[hsl(20,30%,72%)]",
	"bg-[hsl(30,30%,72%)]",
	"bg-[hsl(40,30%,72%)]",
	"bg-[hsl(50,30%,72%)]",
	"bg-[hsl(60,30%,72%)]",
	"bg-[hsl(70,30%,72%)]",
	"bg-[hsl(80,30%,72%)]",
	"bg-[hsl(90,30%,72%)]",
	"bg-[hsl(100,30%,72%)]",
	"bg-[hsl(110,30%,72%)]",
	"bg-[hsl(120,30%,72%)]",
	"bg-[hsl(130,30%,72%)]",
	"bg-[hsl(140,30%,72%)]",
	"bg-[hsl(150,30%,72%)]",
	"bg-[hsl(160,30%,72%)]",
	"bg-[hsl(170,30%,72%)]",
	"bg-[hsl(180,30%,72%)]",
	"bg-[hsl(190,30%,72%)]",
	"bg-[hsl(200,30%,72%)]",
	"bg-[hsl(210,30%,72%)]",
	"bg-[hsl(220,30%,72%)]",
	"bg-[hsl(230,30%,72%)]",
	"bg-[hsl(240,30%,72%)]",
	"bg-[hsl(250,30%,72%)]",
	"bg-[hsl(260,30%,72%)]",
	"bg-[hsl(270,30%,72%)]",
	"bg-[hsl(280,30%,72%)]",
	"bg-[hsl(290,30%,72%)]",
	"bg-[hsl(300,30%,72%)]",
	"bg-[hsl(310,30%,72%)]",
	"bg-[hsl(320,30%,72%)]",
	"bg-[hsl(330,30%,72%)]",
	"bg-[hsl(340,30%,72%)]",
	"bg-[hsl(350,30%,72%)]",
	"bg-[hsl(360,30%,72%)]",
];
