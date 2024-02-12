import Chat from "@/app/(pages)/(app)/(answer-engine)/chat";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { redirect } from "next/navigation";

export const revalidate = 1;
export const metadata = {
  title: "proem - science answers",
};

type Props = {
  params: { share_id: string };
};

export default async function SharePage({ params: { share_id } }: Props) {
  const [sharedAnswer] = await answers.getByShareId(share_id);

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
