import { redirect } from "next/navigation";

type Props = {
  params: { id: string; title: string };
};

export default async function ReaderPageRedirect({ params }: Props) {
  const title = decodeURIComponent(params.title).replaceAll("+", " ");
  redirect(`/oa/${params.id}?title=${encodeURIComponent(title)}`);
}
