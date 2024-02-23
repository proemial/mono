import { Feedback } from "@/app/(pages)/(app)/profile/components/feedback";
import { Privacy } from "@/app/(pages)/(app)/profile/components/privacy";
import { ProfileButtons } from "@/app/(pages)/(app)/profile/components/profile-buttons";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/getProfileFromUser";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { SignedIn, currentUser } from "@clerk/nextjs";

export default async function ProfilePage() {
	const user = await currentUser();
	const userProfile = getProfileFromUser(user);

	return (
		<>
			<SignedIn>
				<div className="w-full p-4 space-y-4">
					<div className="relative flex flex-col overflow-hidden bg-[#1A1A1A] rounded-sm border border-[#3C3C3C]">
						<div className="absolute inset-0 w-full h-full">
							<div className="w-full h-full bg-pattern-amie animate-backgroundScroll" />
						</div>
						<div className="absolute inset-0 w-full h-full" />
						<div className="flex items-center w-full h-48 overflow-hidden px-7">
							<div className="relative flex rounded-full shadow-lg">
								<div className="relative flex items-center justify-center transition-all">
									<div className="absolute top-0 left-0 z-10 flex transition-all duration-200 rounded-full opacity-0 pointer-events-none" />
									<div className="relative overflow-hidden transition-all rounded-full pointer-events-none">
										<Avatar className="h-[110px] w-[110px]">
											<AvatarImage src={user?.imageUrl || ""} alt="avatar" />
											<AvatarFallback className="bg-gray-600">
												{userProfile?.initials}
											</AvatarFallback>
										</Avatar>
									</div>
								</div>
							</div>
						</div>
						<div className="relative flex items-center justify-between w-full pb-8 pl-8 pr-8">
							<div className="flex flex-col">
								<div className="flex items-center gap-1 mb-1.5">
									<h4 className="text-xl font-medium leading-none text-white">
										{userProfile?.fullName}
									</h4>
								</div>
								<h4 className="mt-1 text-sm font-normal leading-none text-white">
									Registered member
								</h4>
							</div>
						</div>
					</div>

					<div className="bg-[#1A1A1A] rounded-sm border border-[#3C3C3C] p-4 divide-y">
						<div className="flex flex-wrap items-center justify-between py-md gap-md">
							<div className="flex">
								<Feedback />
							</div>
							<div className="flex">
								<ProfileButtons />
							</div>
						</div>
					</div>
				</div>
			</SignedIn>

			<Privacy />
		</>
	);
}
