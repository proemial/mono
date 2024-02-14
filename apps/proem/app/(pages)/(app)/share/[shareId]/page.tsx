import Chat from "@/app/(pages)/(app)/(answer-engine)/chat";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { redirect } from "next/navigation";

export const revalidate = 1;
export const metadata = {
  title: "proem - science answers",
};

type Props = {
  params: { shareId: string };
};

export default async function SharePage({ params: { shareId } }: Props) {
  const [sharedAnswer] = await answers.getByShareId(shareId);

  if (!sharedAnswer) {
    redirect("/");
  }

  return (
    <Chat
      initialMessages={[
        { id: "id", role: "assistant", content: sharedAnswer.answer },
      ]}
    />
  );
}
