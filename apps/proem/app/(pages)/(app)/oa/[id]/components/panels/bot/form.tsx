"use client";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { FormEvent } from "react";
import { Button } from "@/app/components/shadcn-ui/button";
import { Send } from "@/app/components/icons/functional/send";
import { Tracker } from "@/app/components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type Props = {
  value: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: any) => void;
};

export function BotForm({ value, onSubmit, onChange }: Props) {
  const { userId } = useAuth();
  const { open } = useDrawerState();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    Tracker.track(analyticsKeys.read.submit.question);
    onSubmit(e);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex flex-row items-center">
        <input
          readOnly={!userId}
          onFocus={() => !userId && open()}
          type="text"
          placeholder="Ask your own question about this paper"
          className="flex w-full h-[42px] text-[16px] font-normal rounded bg-[#1A1A1A] border border-[#4E4E4E] text-white placeholder-green-500 px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 relative break-words stretch"
          value={value}
          onChange={onChange}
        />
        <Button
          variant="send_button"
          size="sm"
          type="submit"
          className="absolute items-center justify-center bg-transparent right-2"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
