import { Input } from "@/app/components/shadcn-ui/input";
import { Button } from "@/app/components/shadcn-ui/button";
import { Send } from "@/app/components/icons/functional/send";

type Props = {
  value?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
};

export function TextInput({ value, disabled, onChange }: Props) {
  return (
    <>
      <Input
        type="text"
        name="q"
        placeholder="Ask anything"
        className="relative break-words stretch"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <Button
        variant="send_button"
        size="sm"
        type="submit"
        className="absolute justify-center bg-transparent right-2"
        disabled={disabled}
      >
        <Send />
      </Button>
    </>
  );
  // return (
  //   <>
  //     <Input
  //       type="text"
  //       name="q"
  //       placeholder="Ask anything"
  //       className="relative break-words stretch"
  //     />
  //     <Button
  //       variant="send_button"
  //       size="sm"
  //       type="submit"
  //       className="absolute justify-center bg-transparent right-4"
  //     >
  //       <Send />
  //     </Button>
  //   </>
  // );
}
