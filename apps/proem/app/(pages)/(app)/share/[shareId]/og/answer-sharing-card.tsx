import { AspectRatio } from "@proemial/shadcn-ui";

type AnswerSharingCardProps = {
  content?: React.ReactNode;
  /**
   * Uses experimental tw to work both in app and with @vercel/og
   */
  classNameAttr?: "className" | "tw";
};

export function AnswerSharingCard({
  content,
  classNameAttr = "className",
}: AnswerSharingCardProps) {
  const twcl = (tailwindClasses: string) => ({
    [classNameAttr]: tailwindClasses,
  });

  return (
    <div
      {...twcl(
        "flex flex-col px-4 pt-4 bg-[#333333] w-full h-full text-white font-sans"
      )}
    >
      <div {...twcl("flex")}>
        <img
          {...twcl("w-7 h-7 rounded-full")}
          src="https://proem.ai/android-chrome-512x512.png"
        />
        <div
          {...twcl(
            "flex flex-col justify-center text-xs leading-none w-full ml-2"
          )}
        >
          <div {...twcl("font-bold leading-none text-xs")}>
            Proem Science Answers
          </div>
          <div {...twcl("font-normal leading-none text-white/50")}>
            Based on 250M research papers
          </div>
        </div>
      </div>

      <p
        {...twcl(
          "flex-inline flex-col text-[14px] font-normal leading-[135%] mt-2 flex-1 line-clamp-3"
        )}
      >
        {content}
      </p>
    </div>
  );
}

// <div className="p-4 space-y-2">
//   <div className="flex gap-3">
//     <Avatar className="w-8 h-8">
//       <AvatarImage src="/android-chrome-512x512.png" />
//     </Avatar>
//     <div className="flex flex-col justify-center w-full gap-0.5 text-xs">
//       <div className="font-bold leading-none">Proem Science Answers</div>
//       <div className="font-normal leading-none text-white/50">
//         Based on 250M research papers
//       </div>
//     </div>
//   </div>
//   <p className="text-sm font-normal">{content}</p>
// </div>;
