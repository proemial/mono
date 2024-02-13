import { PaperCardTop } from "@/app/components/card/paper-card";
import { Avatar, AvatarImage } from "@/app/components/shadcn-ui/Avatar";

type AnswerSharingCardProps = {
  content?: React.ReactNode;
};

export function AnswerSharingCard({ content }: AnswerSharingCardProps) {
  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/android-chrome-512x512.png" />
        </Avatar>
        <div className="flex flex-col justify-center w-full gap-0.5 text-xs">
          <div className="font-bold leading-none">Proem Science Answers</div>
          <div className="font-normal leading-none text-white/50">
            Based on 250M research papers
          </div>
        </div>
      </div>
      <p className="text-sm font-normal">{content}</p>
      <div className="bg-[#3C3C3C] p-2 rounded-sm">
        <PaperCardTop />
      </div>
      <div className="bg-[#3C3C3C] p-2 rounded-sm">
        <PaperCardTop />
      </div>
    </div>
  );
}
