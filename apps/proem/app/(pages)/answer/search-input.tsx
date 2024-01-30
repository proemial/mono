"use client";
import { Send } from "@/app/components/icons/functional/send";
import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { ChangeEvent, FormEvent } from "react";

type SearchInputProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchInput({
  handleSubmit,
  input,
  handleInputChange,
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <form className="flex flex-row items-center" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Ask anything"
          className="relative break-words stretch"
          value={input}
          onChange={handleInputChange}
        />
        <Button
          variant="send_button"
          size="sm"
          type="submit"
          className="absolute justify-center bg-transparent right-2"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
