import { getProfileFromUser } from "@/app/(pages)/(app)/profile/getProfileFromUser";
import { currentUser } from "@clerk/nextjs";
import Chat from "@/app/(pages)/(app)/(answer-engine)/chat";

export const revalidate = 1;

type Props = {
  searchParams: { q: string };
};

export default async function FrontPage({ searchParams }: Props) {
  const user = await currentUser();
  const { fullName, initials } = getProfileFromUser(user);

  return (
    <Chat
      user={
        user
          ? { name: fullName!, initials: initials!, avatar: user?.imageUrl }
          : undefined
      }
      message={searchParams.q}
    />
  );
}
