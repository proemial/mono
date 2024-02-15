"use client";
import Drawer from "@/app/components/drawer/drawer";
import { ShareIcon } from "@/app/components/share/share-icon";
import { useShareDrawerState } from "@/app/components/share/state";
import {
  FacebookIcon,
  Link2Icon,
  LinkedinIcon,
  LucideIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";

type ShareIcon = {
  icon: LucideIcon;
  name: string;
};

type ExternalShareIcon = ShareIcon & {
  createShareLink: (url: string, title: string) => string;
};

type InternalShareIcon = ShareIcon & {
  onClick: (url: string) => void;
};

type ShareProviders = (InternalShareIcon | ExternalShareIcon)[];

const shareProviders: ShareProviders = [
  {
    name: "Copy link",
    icon: Link2Icon,
    onClick: (url: string) => {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost";

      navigator.clipboard.writeText(`${baseUrl}${url}`);
    },
  },
  {
    name: "X",
    icon: TwitterIcon,
    createShareLink: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${title}&url=${encodeURI(url)}`,
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    createShareLink: (url: string, title: string) =>
      `https://www.linkedin.com/shareArticle?url=${url}&title=${title}`,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    createShareLink: (url: string, title: string) =>
      `http://www.facebook.com/sharer.php?u=${url}&p[title]=${title}`,
  },
] as const;

export function ShareDrawer() {
  const { itemToBeShared, closeShareDrawer } = useShareDrawerState();
  const isOpen = Boolean(itemToBeShared);

  return (
    <Drawer isOpen={isOpen} onClose={closeShareDrawer} removeWhenClosed={false}>
      {itemToBeShared && (
        <div className="w-full space-y-4">
          <Image
            width={600}
            height={315}
            src={`${itemToBeShared.link}/og`}
            alt="Image"
          />

          <div className="flex gap-4">
            {shareProviders.map((provider) => {
              if ("onClick" in provider) {
                return (
                  <div onClick={() => provider.onClick(itemToBeShared.link)}>
                    <ShareIcon Icon={provider.icon} text={provider.name} />
                  </div>
                );
              }

              return (
                <a
                  key={provider.name}
                  href={provider.createShareLink(
                    itemToBeShared.link,
                    itemToBeShared.title
                  )}
                  target="_blank"
                >
                  <ShareIcon Icon={provider.icon} text={provider.name} />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </Drawer>
  );
}
