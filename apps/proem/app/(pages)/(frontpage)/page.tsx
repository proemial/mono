import AskInput from "@/app/(pages)/(frontpage)/ask-input";

export const revalidate = 1;

export default async function FrontPage() {
  return (
    <>
      <AskInput />
    </>
  );
}
