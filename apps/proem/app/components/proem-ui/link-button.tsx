import Link from "next/link";

type Props = {
  children: string;
  href: string;
  className?: string;
};

export function LinkButton({ children, href, className }: Props) {
  return (
    <Link
      href={href}
      className={`rounded-sm bg-[#7DFA86] font-sans text-black text-lg font-light py-2 px-4 text-center scale-100 active:scale-[0.98] transition-all duration-100 ${className}`}
    >
      {children}
    </Link>
  );
}
