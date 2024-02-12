"use client";

type Props = {
  children: string;
  active?: boolean;
  onClick?: (item: string) => void;
};

export default function Tab({ children, active, onClick }: Props) {
  const style = active ? "bg-[#7DFA86] text-black" : "text-white/50";

  return (
    <div
      className={`px-2 py-1 rounded-[2px] whitespace-nowrap font-light ${style} cursor-pointer`}
      onClick={() => onClick && onClick(children)}
    >
      {children}
    </div>
  );
}
