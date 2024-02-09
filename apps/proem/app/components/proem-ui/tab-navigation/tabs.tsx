"use client";

import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const Tab = dynamic(() => import("./tab"));

type Props = {
  items: string[];
  rootPath: string;
};

function useActiveTab(defaultTab: string) {
  const pathname = usePathname();

  const conceptFromPath = pathname?.split("/")[2];
  const conceptFromCookie = getCookie("latestFeedConcept") as string;
  const activeTab = conceptFromPath ?? conceptFromCookie ?? defaultTab;

  const active = decodeURI(activeTab);
  const fromPath = conceptFromPath ? decodeURI(conceptFromPath) : undefined;

  if (conceptFromPath) {
    if (conceptFromPath !== "all") {
      setCookie("latestFeedConcept", conceptFromPath);
    } else {
      deleteCookie("latestFeedConcept");
    }
  }

  return { active, fromPath };
}

export function TabNavigation({ items, rootPath }: Props) {
  const router = useRouter();
  const { active, fromPath } = useActiveTab(items[0] as string);

  useEffect(() => {
    if (fromPath !== active) {
      router.replace(`${rootPath}/${active}`);
    }
  }, [active, fromPath]);

  const handleChildClick = (item: string) => {
    router.replace(`${rootPath}/${item}`);
  };

  // TODO: Scroll to active tab on mount
  return (
    <>
      <div className="max-w-screen-sm px-4 flex gap-1 text-[14px] overflow-x-scroll no-scrollbar">
        {items.map((item) => (
          <Tab key={item} active={active === item} onClick={handleChildClick}>
            {item}
          </Tab>
        ))}
      </div>
    </>
  );
}
