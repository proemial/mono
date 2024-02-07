import { Search } from "lucide-react";
import { LinkButton } from "@/app/components/proem-ui/link-button";
import { fetchLatestPaperIds } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { AskInput } from "@/app/(pages)/(app)/oa/ask-input";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

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
      <div className="text-md text-white/80">
        <div>To find an interesting paper, start by</div>
        <div>asking a question, or go to the feed</div>
        <div>and click a summary of a recent paper</div>
        <div>from a domain you are interested in.</div>
        <div>You can also just click one of the</div>
        <div>suggestions below.</div>
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
      <LinkButton
        href="/feed"
        className="mb-2"
        track={analyticsKeys.read.click.feed}
      >
        Open your feed
      </LinkButton>
      <LinkButton
        href={`/oa/${randomId}`}
        className="mb-2"
        track={analyticsKeys.read.click.random}
      >
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
          track={analyticsKeys.read.click.askStarter}
        >
          {starter.text}
        </LinkButton>
      ))}
      <div className="relative w-full">
        <AskInput />
      </div>
    </div>
  );
}
