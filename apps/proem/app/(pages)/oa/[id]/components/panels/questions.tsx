import { InsightsBot } from "./bot/bot";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Panel } from "@/app/components/panel";

type Props = {
  paper: OpenAlexPaper;
  closed?: boolean;
};

export function QuestionsPanel(props: Props) {
  // TODO: Generate suggestions
  return (
    <Panel title="question" closed={props.closed}>
      <div className="pt-4 flex flex-col justify-start">
        <InsightsBot {...props} suggestions={[]} />
      </div>
    </Panel>
  );
}
