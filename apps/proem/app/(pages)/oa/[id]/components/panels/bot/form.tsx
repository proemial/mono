"use client";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { FormEvent } from "react";

type Props = {
  value: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: any) => void;
};

export function BotForm({ value, onSubmit, onChange }: Props) {
  const { userId } = useAuth();
  const { open } = useDrawerState();

  return (
    <form
      onSubmit={onSubmit}
      className="flex bg-black items-center border border-[#3C3C3C] rounded-lg justify-end"
    >
      <input
        readOnly={!userId}
        onFocus={() => !userId && open()}
        type="text"
        placeholder="Ask your own question"
        className="w-full font-sans bg-transparent text-[16px] font-normal pl-3 py-2 focus-visible:outline-none"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          scrollMargin: 16,
        }}
        value={value}
        onChange={onChange}
      />
    </form>
  );
}
