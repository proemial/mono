import { ProfileButtons } from "@/app/(pages)/profile/profile-buttons";
import { MegaPhone } from "@/app/components/icons/objects/megaphone";
import { PageHeader } from "@/app/components/page-header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { SignedIn, currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await currentUser();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const initials = fullName.split(" ").map((name) => name.charAt(0));

  return (
    <div className="flex min-h-full max-w-screen-md flex-col mx-auto">
      <PageHeader>Profile</PageHeader>

      <SignedIn>
        <div className="my-8 px-4 space-y-6">

          <div className="relative flex flex-col overflow-hidden bg-[#1A1A1A] rounded-sm border border-[#3C3C3C]">
            <div className="absolute inset-0 h-full w-full">
              <div className="bg-pattern-amie h-full w-full animate-backgroundScroll" >
              </div>
            </div>
            <div className="absolute inset-0 h-full w-full"></div>
            <div className="flex h-48 w-full items-center overflow-hidden px-7">
              <div className="relative flex rounded-full shadow-lg">
                <div className="relative flex items-center justify-center transition-all">
                  <div className="pointer-events-none absolute top-0 left-0 z-10 flex rounded-full transition-all duration-200 opacity-0"></div>
                  <div className="pointer-events-none relative overflow-hidden rounded-full transition-all">
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
            <div className="relative flex w-full items-center justify-between pb-8 pl-8 pr-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1.5">
                  <h4 className="text-xl font-sans text-white font-medium leading-none">{fullName}</h4>
                </div>
                <h4 className="text-white mt-1 text-sm font-sans font-normal leading-none">Free member</h4>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-sm border border-[#3C3C3C] p-4 divide-y">
            <div className="flex justify-between py-md items-center flex-wrap gap-md">
              <div className="flex">
                <a className="md:hover:bg-offsetPlus text-textMain dark:text-textMainDark dark:md:hover:bg-offsetPlusDark focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out font-sans  select-none items-center relative group  justify-center text-center rounded cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-sm px-sm font-medium h-8" href="https://blog.perplexity.ai/faq">
                  <div className="flex items-center leading-none justify-center gap-xs">
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="book" className="svg-inline--fa fa-book fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M0 88C0 39.4 39.4 0 88 0H392c30.9 0 56 25.1 56 56V344c0 22.3-13.1 41.6-32 50.6V464h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H80c-44.2 0-80-35.8-80-80c0-2.7 .1-5.4 .4-8H0V88zM80 400c-17.7 0-32 14.3-32 32s14.3 32 32 32H368V400H80zM48 358.7c9.8-4.3 20.6-6.7 32-6.7H392c4.4 0 8-3.6 8-8V56c0-4.4-3.6-8-8-8H88C65.9 48 48 65.9 48 88V358.7zM152 112H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path>
                    </svg>
                  </div>
                </a>
                <a className="hover:bg-[#2F2F2F] p-2 outline-none outline-transparent transition duration-300 ease-in-out font-sans select-none items-center relative group justify-center text-center rounded-sm cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex font-medium" href="/">
                  <div className="flex items-center leading-none justify-center gap-3">
                    <MegaPhone />
                    <div className="text-align-center relative font-sans font-normal text-sm">Feedback</div>
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

      <div className="px-4 bottom-5 inset-x-0">
        <p className="text-xs text-left leading-snug font-normal text-gray-500">
          Proemial reserves all rights. Read our <Link href="" className="underline">Privacy Policy.</Link>
        </p>
        <p className="text-xs text-left leading-snug font-normal text-gray-500">
          Proemial A/S. DK-8000 Aarhus C. CVR no.: 44250543. Email: hi@proemial.ai.
        </p>
      </div>
    </div>
  );
}
