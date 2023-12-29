"use client";
import { FormEvent, MutableRefObject } from "react";
import { useUser } from "@clerk/nextjs";
import { useDrawerState } from "@/app/components/login/state";
import { PaperPlaneIcon } from "@/app/components/icons/paperplane";

type Props = {
  value: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: any) => void;
  inputFieldRef: MutableRefObject<HTMLInputElement | null>;
};

export function BotForm({ value, onSubmit, onChange, inputFieldRef }: Props) {
  const { user } = useUser();
  const { open } = useDrawerState();

  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <input
        readOnly={!user}
        onFocus={() => !user && open()}
        type="text"
        placeholder="Ask your own question"
        className="w-full bg-black border-input border-l-2 border-y-2 rounded-tl-lg rounded-bl-lg p-3 focus-visible:outline-none"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          scrollMargin: 16,
        }}
        value={value}
        onChange={onChange}
        ref={inputFieldRef}
      />
      <button
        onClick={() => !user && open()}
        type="submit"
        className="p-3 pt-4 border-input border-r-2 border-y-2 rounded-tr-lg rounded-br-lg"
      >
        <PaperPlaneIcon />
      </button>
    </form>
  );
}
