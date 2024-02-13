"use client";
import { AnswerSharingCard } from "@/app/(pages)/(app)/(answer-engine)/og/answer-sharing-card";
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
      alert(url);
    },
  },
  {
    name: "X",
    icon: TwitterIcon,
    createShareLink: (url: string, title: string) =>
      `http://twitter.com/share?text=${title}&url=${url}`,
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
  const { itemToBeShared, close } = useShareDrawerState();
  const isOpen = Boolean(itemToBeShared);

  return (
    <Drawer isOpen={isOpen} onClose={close} removeWhenClosed={false}>
      <div className="w-full space-y-4">
        <AnswerSharingCard content={itemToBeShared?.content} />

        <div className="flex gap-4">
          {shareProviders.map((provider) => {
            if ("onClick" in provider) {
              return <ShareIcon Icon={provider.icon} text={provider.name} />;
            }

            return (
              <a
                href={provider.createShareLink(itemToBeShared?.link!, "proem")}
                target="_blank"
              >
                <ShareIcon Icon={provider.icon} text={provider.name} />
              </a>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
}
