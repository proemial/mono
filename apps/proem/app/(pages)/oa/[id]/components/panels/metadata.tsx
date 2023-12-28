import dayjs from "dayjs";
import avatar from "@/app/images/avatar.svg";
import Image from "next/image";
import Markdown from "@/app/(pages)/oa/[id]/components/markdown";
import { Panel } from "@/app/components/panel";
import { OpenAlexPaper } from "@proemial/models/open-alex";

type Props = {
  paper: OpenAlexPaper;
  closed?: boolean;
};

export function MetadataPanel({ paper, closed }: Props) {
  return (
    <Panel title="metadata" closed={closed}>
      <div>
        <div>
          <div className="text-purple-500">
            {paper.data.primary_location?.source?.host_organization_name}
            {" - "}
            {dayjs(paper.data.publication_date).format("MMM DD, YYYY")}
          </div>
        </div>
        <Markdown>{paper.data.title}</Markdown>
      </div>
      <div className="text-purple-500 mt-2">Authors</div>
      <div className="flex py-2 gap-10 flex-nowrap overflow-scroll no-scrollbar">
        {paper.data.authorships.map((author, index) => (
          <Author key={index} name={author.author.display_name} />
        ))}
      </div>
    </Panel>
  );
}

function Author({ name }: { name: string }) {
  const names = name.split(" ");
  return (
    <div className="whitespace-nowrap flex gap-1">
      <Image src={avatar} alt="" />
      {names.at(-1)}
    </div>
  );
}
