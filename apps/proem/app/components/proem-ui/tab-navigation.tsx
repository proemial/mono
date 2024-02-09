"use client";

import { usePathname, useRouter } from "next/navigation";
// import { getCookie, setCookie } from "cookies-next";

type Props = {
  items: string[];
  rootPath: string;
};

function useActiveTab(defaultTab: string) {
  const pathname = usePathname();

  // TODO: Fix remember latest and scroll to it
  // latestFeedConcept
  // const latestFeedConcept = getCookie("latestFeedConcept");
  const activeTab = pathname?.split("/")[2] ?? defaultTab;
  return decodeURI(activeTab);
}

export function TabNavigation({ items, rootPath }: Props) {
  const router = useRouter();
  const active = useActiveTab(items[0] as string);

  const handleChildClick = (item: string) => {
    router.replace(`${rootPath}/${item}`);
  };

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
  const style = active ? "bg-[#7DFA86] text-black" : "text-white/50";
  return (
    <div
      className={`px-2 py-1 rounded-[2px] whitespace-nowrap font-sans font-light ${style} cursor-pointer`}
      onClick={() => onClick && onClick(children)}
    >
      {children.toLowerCase()}
    </div>
  );
}
