"use client";

import { usePathname, useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";

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

type TabProps = {
  children: string;
  active?: boolean;
  onClick?: (item: string) => void;
};

export function Tab({ children, active, onClick }: TabProps) {
  //     Opt out of SSR     //
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  ////////////////////////////

  const style = active ? "bg-[#7DFA86] text-black" : "text-white/50";
  return (
    <div
      className={`px-2 py-1 rounded-[2px] whitespace-nowrap font-sans font-light ${style} cursor-pointer`}
      onClick={() => onClick && onClick(children)}
    >
      {children}
    </div>
  );
}
