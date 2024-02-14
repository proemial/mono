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
        "flex flex-col p-9 bg-[#333333] w-full h-full text-white font-sans"
      )}
    >
      <div {...twcl("flex")}>
        <img
          {...twcl("w-8 h-8 rounded-full")}
          src="https://proem.ai/android-chrome-512x512.png"
        />
        <div {...twcl("flex flex-col justify-center leading-none w-full ml-2")}>
          <div {...twcl("font-bold leading-none")}>Proem Science Answers</div>
          <div {...twcl("font-normal leading-none text-white/50")}>
            Based on 250M research papers
          </div>
        </div>
      </div>

      <p
        {...twcl(
          "flex-inline flex-col text-sm font-normal leading-relaxed mt-2"
        )}
      >
        {content}
      </p>
    </div>
  );
}
