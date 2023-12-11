import Image from "next/image";
import proem from "@/app/images/logo.png";
import google from "@/app/images/google.svg";
import twitter from "@/app/images/twitter.svg";
import github from "@/app/images/github.svg";

const logos = { logo: proem, google, twitter, github };

type Props = {
  variant?: "proem" | "google" | "twitter" | "github";
  className?: string;
};
export function Logo({ variant = "proem", className }: Props) {
  return (
    <Image
      height={16}
      width={16}
      className={className}
      // @ts-ignore
      src={logos[variant]}
      alt=""
    />
  );
}
