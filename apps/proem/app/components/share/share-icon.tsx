import { LucideIcon } from "lucide-react";

export type ShareIconProps = {
  text: string;
  Icon: LucideIcon | (() => JSX.Element);
};
export function ShareIcon({ text, Icon }: ShareIconProps) {
  return (
    <div className="flex flex-col text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full text-red">
        <Icon color="black" size={32} />
      </div>
      <div className="text-xs font-normal">{text}</div>
    </div>
  );
}
