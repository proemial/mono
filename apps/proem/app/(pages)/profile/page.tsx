import { getProfileFromUser } from "@/app/(pages)/profile/getProfileFromUser";
import { ProfileButtons } from "@/app/(pages)/profile/profile-buttons";
import { MegaPhone } from "@/app/components/icons/objects/megaphone";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { SignedIn, currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await currentUser();
  const { fullName, initials } = getProfileFromUser(user);

  return (
    <>
      <SignedIn>
        <div className="w-full px-4 my-8 space-y-6">
          <div className="relative flex flex-col overflow-hidden bg-[#1A1A1A] rounded-sm border border-[#3C3C3C]">
            <div className="absolute inset-0 w-full h-full">
              <div className="w-full h-full bg-pattern-amie animate-backgroundScroll"></div>
            </div>
            <div className="absolute inset-0 w-full h-full"></div>
            <div className="flex items-center w-full h-48 overflow-hidden px-7">
              <div className="relative flex rounded-full shadow-lg">
                <div className="relative flex items-center justify-center transition-all">
                  <div className="absolute top-0 left-0 z-10 flex transition-all duration-200 rounded-full opacity-0 pointer-events-none"></div>
                  <div className="relative overflow-hidden transition-all rounded-full pointer-events-none">
                    <Avatar className="h-[110px] w-[110px]">
                      <AvatarImage src={user?.imageUrl || ""} alt="avatar" />
                      <AvatarFallback className="bg-gray-600">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-between w-full pb-8 pl-8 pr-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1.5">
                  <h4 className="font-sans text-xl font-medium leading-none text-white">
                    {fullName}
                  </h4>
                </div>
                <h4 className="mt-1 font-sans text-sm font-normal leading-none text-white">
                  Registered member
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-sm border border-[#3C3C3C] p-4 divide-y">
            <div className="flex flex-wrap items-center justify-between py-md gap-md">
              <div className="flex">
                <a
                  className="relative inline-flex items-center justify-center h-8 font-sans text-sm font-medium text-center transition duration-300 ease-in-out origin-center rounded outline-none select-none md:hover:bg-offsetPlus text-textMain dark:text-textMainDark dark:md:hover:bg-offsetPlusDark focus:outline-none outline-transparent group cursor-point active:scale-95 whitespace-nowrap px-sm"
                  href="https://blog.perplexity.ai/faq"
                >
                  <div className="flex items-center justify-center leading-none gap-xs">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="book"
                      className="svg-inline--fa fa-book fa-fw fa-1x "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M0 88C0 39.4 39.4 0 88 0H392c30.9 0 56 25.1 56 56V344c0 22.3-13.1 41.6-32 50.6V464h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H80c-44.2 0-80-35.8-80-80c0-2.7 .1-5.4 .4-8H0V88zM80 400c-17.7 0-32 14.3-32 32s14.3 32 32 32H368V400H80zM48 358.7c9.8-4.3 20.6-6.7 32-6.7H392c4.4 0 8-3.6 8-8V56c0-4.4-3.6-8-8-8H88C65.9 48 48 65.9 48 88V358.7zM152 112H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a
                  className="hover:bg-[#2F2F2F] p-2 outline-none outline-transparent transition duration-300 ease-in-out font-sans select-none items-center relative group justify-center text-center rounded-sm cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex font-medium"
                  href="https://tally.so/r/wAv8Ve"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-center gap-3 leading-none">
                    <MegaPhone />
                    <div className="relative font-sans text-sm font-normal text-align-center">
                      Feedback
                    </div>
                  </div>
                </a>
              </div>
              <div className="flex">
                <ProfileButtons />
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <div className="inset-x-0 px-4 bottom-5">
        <p className="text-xs font-normal leading-snug text-left text-gray-500">
          Proemial reserves all rights. Read our{" "}
          <Link href="" className="underline">
            Privacy Policy.
          </Link>
        </p>
        <p className="text-xs font-normal leading-snug text-left text-gray-500">
          Proemial ApS. DK-8000 Aarhus C. CVR no.: 44250543. Email:
          hi@proemial.ai.
        </p>
      </div>
    </>
  );
}
