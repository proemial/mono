import { Avatar, AvatarFallback, AvatarImage } from "@proemial/shadcn-ui";

type Props = {
	firstName: string | null;
	lastName: string | null;
	imageUrl: string | undefined;
};

export const AuthorAvatar = ({ firstName, lastName, imageUrl }: Props) => {
	return (
		<Avatar
			className="-ml-[18px] first:ml-0 size-6 hover:brightness-110 duration-200"
			title={getFullName(firstName, lastName)}
		>
			<AvatarImage src={imageUrl} />
			<AvatarFallback className="text-xs">
				{getInitials(firstName, lastName)}
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
