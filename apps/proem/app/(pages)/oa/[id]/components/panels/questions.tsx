import { InsightsBot } from "./bot/bot";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Panel } from "@/app/components/panel";
import { Redis } from "@proemial/redis/redis";
import { generateStarters } from "@/app/prompts/starters";

type Props = {
  paper: OpenAlexPaper;
  closed?: boolean;
};

export async function QuestionsPanel(props: Props) {
  const { paper } = props;
  const starters = paper?.generated?.starters
    ? paper?.generated?.starters
    : await generate(paper);

  return (
    <Panel title="question" closed={props.closed}>
      <div className="pt-4 flex flex-col">
        <InsightsBot {...props} suggestions={starters} />
      </div>
    </Panel>
  );
}

async function generate(paper: OpenAlexPaper) {
  const paperTitle = paper?.data?.title;
  const abstract = paper?.data?.abstract;

  if (paperTitle && abstract) {
    const starters = await generateStarters(paperTitle, abstract);

    await Redis.papers.upsert(paper.id, (existingPaper) => {
      const generated = existingPaper.generated
        ? { ...existingPaper.generated, starters }
        : { starters };

      return {
        ...existingPaper,
        generated,
      };
    });

    return starters;
  }
  return [];
}
