"use client";
import { BotFormTrigger } from "@/app/components/drawer-triggers/BotForm";
import { Send } from "@/app/components/icons/functional/send";
import { PaperPlaneIcon } from "@/app/components/icons/paperplane";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { FormEvent, MutableRefObject } from "react";

type Props = {
  value: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: any) => void;
  inputFieldRef: MutableRefObject<HTMLInputElement | null>;
};

export function BotForm({ value, onSubmit, onChange, inputFieldRef }: Props) {
  const { userId } = useAuth();
  const { open } = useDrawerState();

  return (
    <form onSubmit={onSubmit} className="flex bg-black items-center border border-[#3C3C3C] rounded-lg justify-end">
      <input
        readOnly={!userId}
        onFocus={() => !userId && open()}
        type="text"
        placeholder="Ask your own question"
        className="w-full bg-transparent text-[16px] font-normal pl-3 py-2 focus-visible:outline-none"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          scrollMargin: 16,
        }}
        value={value}
        onChange={onChange}
        ref={inputFieldRef}
      />

      <BotFormTrigger />

      {/* ↓↓↓ Button without trigger ↓↓↓  */}

      {/* <button
        onClick={() => !userId && open()}
        type="submit"
        className="pr-3"
      >
        <Send />
      </button> */}

    </form>
  );
}