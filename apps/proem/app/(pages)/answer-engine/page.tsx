import Chat from "@/app/(pages)/answer-engine/chat";
import { CenteredSpinner } from "@/app/components/spinner";
import { Suspense } from "react";

export const revalidate = 1;

export default async function AnswerEngine() {
  return (
    <Suspense fallback={<CenteredSpinner />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  return (
    <div className="p-6">
      <Chat />
    </div>
  );
}
