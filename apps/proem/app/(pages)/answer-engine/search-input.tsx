"use client";
import { Send } from "@/app/components/icons/functional/send";
import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchInputProps = {
  handleSubmit?: (e: any) => void;
  input?: string;
  handleInputChange?: (e: any) => void;
};

// TODO: Remove logic from the component
export default function SearchInput({
  handleSubmit,
  input,
  handleInputChange,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  return (
    <div className="w-full py-6">
      <form
        className="relative"
        onSubmit={
          handleSubmit
            ? handleSubmit
            : (event) => {
                event.preventDefault();
                router.push(`/search?q=${searchValue}`);
              }
        }
      >
        <Input
          type="text"
          placeholder="Ask anything"
          className="pr-10 border border-white/30 text-white/80 placeholder:text-white/30"
          value={input ? input : searchValue}
          onChange={
            handleInputChange
              ? handleInputChange
              : (e) => setSearchValue(e.target.value)
          }
        />
        <Button
          variant="ghost"
          type="submit"
          className="absolute top-0 right-0"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
