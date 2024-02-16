import { applyLinksAsSpans } from "@/app/(pages)/(app)/oa/[id]/components/panels/bot/apply-links";
import { AnswerSharingCard } from "@/app/(pages)/(app)/share/[shareId]/og/answer-sharing-card";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { cn } from "@/app/components/shadcn-ui/utils";
import { ImageResponse } from "next/og";

export const runtime = "edge";

// export const alt = "My images alt text";
// export const size = { width: 1200, height: 630 };
// export const contentType = "image/png";
export async function GET(request: Request) {
  try {
    console.log({ request: request.url });
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("shareId");
    console.log({ shareId });
    if (!shareId) {
      throw new Error("No shareId provided in the url");
    }

    const [sharedAnswer] = await answers.getByShareId(shareId);
    if (!sharedAnswer) {
      throw new Error("no shared answer found for the given shareId");
    }

    const helveticaBold = await fetch(
      new URL(
        "../../../../../../assets/fonts/helvetica/Helvetica-Bold.ttf",
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer());

    const helvetica = await fetch(
      new URL(
        "../../../../../../assets/fonts/helvetica/Helvetica.ttf",
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer());

    const { content } = applyLinksAsSpans(sharedAnswer.answer);
    const contentSplittedInSpans = content.map(splitEachWordToSpan);

    return new ImageResponse(
      <AnswerSharingCard content={contentSplittedInSpans} classNameAttr="tw" />,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "helvetica",
            data: helvetica,
            weight: 400,
          },
          {
            name: "helvetica",
            data: helveticaBold,
            weight: 700,
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

export function splitEachWordToSpan(element: JSX.Element) {
  if (element.props.children.props) {
    return splitEachWordToSpan(element.props.children);
  }

  return element.props.children.split(" ").map((word: string) => {
    return <span tw={cn("mr-2", element.props.tw)}>{word}</span>;
  });
}
