import { getProfileFromUser } from "@/app/(pages)/profile/getProfileFromUser";
import { currentUser } from "@clerk/nextjs";
import Chat from "@/app/(pages)/(answer-engine)/chat";

export const revalidate = 1;

export default async function FrontPage() {
  // const latestIds = await fetchLatestPaperIds()

  // return (
  //   <div className="flex flex-col max-w-screen-sm min-h-full mx-auto justify-begin">
  //     <Suspense fallback={<CenteredSpinner />}>
  //       <PageContent latestIds={latestIds} />
  //     </Suspense>
  //   </div>
  // );
  const user = await currentUser();
  const { fullName, initials } = getProfileFromUser(user);

  return (
    <Chat
      user={
        user
          ? { name: fullName!, initials: initials!, avatar: user?.imageUrl }
          : undefined
      }
    />
  );
}
