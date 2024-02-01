import { Search } from "lucide-react";
import { LinkButton } from "@/app/components/proem-ui/link-button";
import { fetchLatestPaperIds } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { Input } from "@/app/components/shadcn-ui/input";
import { Button } from "@/app/components/shadcn-ui/button";
import { Send } from "@/app/components/icons/functional/send";

export const revalidate = 1;

export default async function ReadPage() {
  return (
    <div className="h-full max-w-screen-sm flex flex-col px-2">
      <div className="h-full flex flex-col text-center items-center justify-center px-8 font-sans">
        <Text />
      </div>
      <div className="flex flex-col gap-2 py-2 text-xs font-light">
        <Actions />
        <Questions />
      </div>
    </div>
  );
}

function Text() {
  return (
    <>
      <div className="text-xl pb-4">No Paper Selected</div>
      <div className="text-md text-white/50">
        To find an interesting paper, start by asking a question, or go to the
        feed and click a summary of a recent paper from a domain you are
        interested in. You can also just click one of the suggestions below.
      </div>
    </>
  );
}

async function Actions() {
  const latestIds = await fetchLatestPaperIds();
  const randomId = latestIds
    ? latestIds[Math.floor(Math.random() * latestIds.length)]
    : "";

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
        SUGGESTED ACTIONS
      </div>
      <LinkButton href="/feed" className="mb-2">
        Open your feed
      </LinkButton>
      <LinkButton href={`/oa/${randomId}`} className="mb-2">
        Open a random recent paper
      </LinkButton>
    </div>
  );
}

function Questions() {
  const starters = STARTERS.map((text, index) => ({ index, text }))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="flex items-center font-sourceCodePro">
        <Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
        SUGGESTED QUESTIONS
      </div>
      {starters.map((starter) => (
        <LinkButton
          key={starter.index}
          href={`/?q=${encodeURIComponent(starter.text)}`}
          variant="starter"
          className="mb-2"
        >
          {starter.text}
        </LinkButton>
      ))}
      <AskInput />
    </div>
  );
}

function AskInput() {
  return (
    <form className="flex flex-row items-center" action="/" method="get">
      <Input
        type="text"
        name="q"
        placeholder="Ask anything"
        className="relative break-words stretch"
      />
      <Button
        variant="send_button"
        size="sm"
        type="submit"
        className="absolute justify-center bg-transparent right-4"
      >
        <Send />
      </Button>
    </form>
  );
}
