import Link from "next/link";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/app/components/shadcn-ui/utils";
import { Send } from "@/app/components/icons/functional/send";

type Props = VariantProps<typeof variants> & {
  children: string;
  href: string;
  className?: string;
};

const variants = cva("rounded-sm font-sans", {
  variants: {
    variant: {
      default: "bg-[#7DFA86] text-black text-center",
      starter:
        "bg-[#2F2F2F] text-white flex justify-between items-center border border-[#4E4E4E]",
    },
    size: {
      default: "text-lg font-light py-2 px-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export function LinkButton(props: Props) {
  const { children, href, variant, size, className } = props;

  return (
    <Link
      href={href}
      className={`${cn(variants({ variant, size, className }))}`}
    >
      <div className="w-full truncate mr-2">{children}</div>
      {variant === "starter" && <Send />}
    </Link>
  );
}
